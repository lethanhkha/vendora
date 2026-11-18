import { NextRequest, NextResponse } from "next/server";
import { db, vendorOrders, masterOrders, orderItems, users } from "@/shared/db";
import { eq, and, gt, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get("vendorId");
    const since = searchParams.get("since");

    if (!vendorId) {
      return NextResponse.json({ error: "Missing vendorId parameter" }, { status: 400 });
    }

    const conditions = [eq(vendorOrders.vendorId, vendorId)];
    if (since) {
      const sinceDate = new Date(since);
      if (!isNaN(sinceDate.getTime())) {
        conditions.push(gt(vendorOrders.createdAt, sinceDate));
      }
    }

    const latestOrders = await db
      .select({
        id: vendorOrders.id,
        subOrderNumber: vendorOrders.subOrderNumber,
        subtotalAmount: vendorOrders.subtotalAmount,
        shippingFee: vendorOrders.shippingFee,
        status: vendorOrders.status,
        createdAt: vendorOrders.createdAt,
        masterOrderNumber: masterOrders.orderNumber,
        recipientName: masterOrders.recipientName,
        recipientPhone: masterOrders.recipientPhone,
      })
      .from(vendorOrders)
      .innerJoin(masterOrders, eq(vendorOrders.masterOrderId, masterOrders.id))
      .where(and(...conditions))
      .orderBy(desc(vendorOrders.createdAt))
      .limit(5);

    return NextResponse.json({
      success: true,
      orders: latestOrders,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Live Orders API Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
