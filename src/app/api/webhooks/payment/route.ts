import { NextRequest, NextResponse } from "next/server";
import { db, masterOrders, vendorOrders } from "@/shared/db";
import { eq, or } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, orderId, amount, transactionId, secret } = body;

    // Verify secret if configured
    const expectedSecret = process.env.PAYMENT_WEBHOOK_SECRET;
    if (expectedSecret && secret !== expectedSecret) {
      const headerSecret = request.headers.get("x-webhook-secret");
      if (headerSecret !== expectedSecret) {
        return NextResponse.json({ error: "Unauthorized webhook" }, { status: 401 });
      }
    }

    if (!orderNumber && !orderId) {
      return NextResponse.json(
        { error: "Missing orderNumber or orderId in webhook payload" },
        { status: 400 }
      );
    }

    // Find the Master Order
    const [order] = await db
      .select()
      .from(masterOrders)
      .where(
        orderId
          ? eq(masterOrders.id, orderId)
          : eq(masterOrders.orderNumber, orderNumber)
      );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If order already paid, return idempotent response
    if (order.paymentStatus === "PAID") {
      return NextResponse.json({
        success: true,
        message: "Order already marked as PAID",
        orderId: order.id,
        orderNumber: order.orderNumber,
      });
    }

    // Verify amount if provided
    if (amount && Math.abs(Number(order.totalAmount) - Number(amount)) > 1) {
      console.warn(
        `[Payment Webhook] Amount mismatch for order ${order.orderNumber}. Expected: ${order.totalAmount}, Received: ${amount}`
      );
    }

    // Update Master Order to PAID
    const [updatedMaster] = await db
      .update(masterOrders)
      .set({
        paymentStatus: "PAID",
        overallStatus: "PROCESSING",
        updatedAt: new Date(),
      })
      .where(eq(masterOrders.id, order.id))
      .returning();

    // Cascade update all associated Vendor Sub-Orders to PROCESSING
    await db
      .update(vendorOrders)
      .set({
        status: "PROCESSING",
        updatedAt: new Date(),
      })
      .where(eq(vendorOrders.masterOrderId, order.id));

    console.log(
      `[Payment Webhook] Successfully processed payment for Order ${order.orderNumber} (TX: ${transactionId || "N/A"})`
    );

    return NextResponse.json({
      success: true,
      message: "Payment successfully confirmed via webhook",
      orderId: updatedMaster.id,
      orderNumber: updatedMaster.orderNumber,
      paymentStatus: updatedMaster.paymentStatus,
    });
  } catch (error: any) {
    console.error("[Payment Webhook Error]:", error);
    return NextResponse.json(
      { error: "Internal server error processing payment webhook", details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to query live payment status for client polling
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");

  if (!orderId && !orderNumber) {
    return NextResponse.json(
      { error: "Provide orderId or orderNumber parameter" },
      { status: 400 }
    );
  }

  const [order] = await db
    .select({
      id: masterOrders.id,
      orderNumber: masterOrders.orderNumber,
      paymentStatus: masterOrders.paymentStatus,
      overallStatus: masterOrders.overallStatus,
      totalAmount: masterOrders.totalAmount,
    })
    .from(masterOrders)
    .where(
      orderId
        ? eq(masterOrders.id, orderId)
        : eq(masterOrders.orderNumber, orderNumber!)
    );

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    orderId: order.id,
    orderNumber: order.orderNumber,
    paymentStatus: order.paymentStatus,
    overallStatus: order.overallStatus,
    isPaid: order.paymentStatus === "PAID",
  });
}
