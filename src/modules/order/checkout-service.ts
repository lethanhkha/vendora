import { db, masterOrders, vendorOrders, orderItems } from "@/shared/db";
import { eq } from "drizzle-orm";
import { CartItem, calculateCartSummary } from "@/modules/cart/cart-service";
import { recordOutboxEvent, processOutboxEvent } from "@/shared/events/outbox-processor";
import { OrderCreatedPayload } from "@/shared/events/event-bus";

export type CheckoutInput = {
  buyerId: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  paymentMethod: "COD" | "SANDBOX" | "VIETQR" | string;
  items: CartItem[];
  voucherDiscount?: number;
};

export async function processCheckout(input: CheckoutInput) {
  if (!input.items || input.items.length === 0) {
    throw new Error("Giỏ hàng của bạn đang trống");
  }

  const summary = calculateCartSummary(input.items);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `VND-${randomSuffix}`;
  const finalTotal = Math.max(0, summary.grandTotal - (input.voucherDiscount || 0));

  // Execute in atomic transaction
  const result = await db.transaction(async (tx) => {
    // 1. Create Master Order
    const [masterOrder] = await tx
      .insert(masterOrders)
      .values({
        orderNumber,
        buyerId: input.buyerId,
        recipientName: input.recipientName,
        recipientPhone: input.recipientPhone,
        shippingAddress: input.shippingAddress,
        totalAmount: finalTotal.toString(),
        paymentMethod: input.paymentMethod,
        paymentStatus: input.paymentMethod === "SANDBOX" ? "PAID" : "PENDING",
        overallStatus: "PENDING",
      })
      .returning();

    const createdVendorOrders: OrderCreatedPayload["vendorOrders"] = [];
    const charCodeBase = 65; // 'A'

    // 2. Split Order across Vendors
    for (let i = 0; i < summary.groups.length; i++) {
      const group = summary.groups[i];
      const subOrderSuffix = String.fromCharCode(charCodeBase + i);
      const subOrderNumber = `${orderNumber}-${subOrderSuffix}`;

      const [vendorOrder] = await tx
        .insert(vendorOrders)
        .values({
          subOrderNumber,
          masterOrderId: masterOrder.id,
          vendorId: group.vendorId,
          subtotalAmount: group.subtotal.toString(),
          shippingFee: group.shippingFee.toString(),
          status: "PENDING",
        })
        .returning();

      // 3. Insert Order Items for this vendor order
      const vendorItemsPayload: OrderCreatedPayload["vendorOrders"][0]["items"] = [];

      for (const item of group.items) {
        await tx.insert(orderItems).values({
          vendorOrderId: vendorOrder.id,
          skuId: item.skuId,
          productTitle: item.productTitle,
          quantity: item.quantity,
          unitPrice: item.price.toString(),
        });

        vendorItemsPayload.push({
          skuId: item.skuId,
          productTitle: item.productTitle,
          quantity: item.quantity,
          unitPrice: item.price.toString(),
        });
      }

      createdVendorOrders.push({
        vendorOrderId: vendorOrder.id,
        subOrderNumber,
        vendorId: group.vendorId,
        items: vendorItemsPayload,
      });
    }

    // 4. Record Domain Event in Transactional Outbox
    const eventPayload: OrderCreatedPayload = {
      masterOrderId: masterOrder.id,
      orderNumber,
      buyerId: input.buyerId,
      buyerName: input.recipientName,
      totalAmount: summary.grandTotal.toString(),
      vendorOrders: createdVendorOrders,
    };

    const outboxRecord = await recordOutboxEvent(
      "OrderCreatedEvent",
      "ORDER",
      masterOrder.id,
      eventPayload,
      tx as any
    );

    return { masterOrder, outboxId: outboxRecord.id };
  });

  // 5. Asynchronously process the outbox event (triggers stock deduction)
  try {
    await processOutboxEvent(result.outboxId);
  } catch (err: any) {
    console.error("[Checkout] Inventory deduction warning:", err.message);
  }

  return result.masterOrder;
}

export async function getMasterOrderDetails(idOrNumber: string) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrNumber);
  const [order] = await db
    .select()
    .from(masterOrders)
    .where(isUuid ? eq(masterOrders.id, idOrNumber) : eq(masterOrders.orderNumber, idOrNumber));

  if (!order) return null;

  const subOrders = await db.query.vendorOrders.findMany({
    where: (vo, { eq }) => eq(vo.masterOrderId, order.id),
    with: {
      vendor: true,
      items: {
        with: {
          sku: true,
        },
      },
    },
  });

  return {
    ...order,
    vendorOrders: subOrders,
  };
}

export async function getBuyerOrdersList(buyerId?: string) {
  return db.query.masterOrders.findMany({
    where: buyerId ? (mo, { eq }) => eq(mo.buyerId, buyerId) : undefined,
    with: {
      vendorOrders: {
        with: {
          vendor: true,
          items: {
            with: {
              sku: true,
            },
          },
        },
      },
    },
    orderBy: (mo, { desc }) => [desc(mo.createdAt)],
  });
}

export async function getVendorOrdersList(vendorId: string) {
  return db.query.vendorOrders.findMany({
    where: (vo, { eq }) => eq(vo.vendorId, vendorId),
    with: {
      masterOrder: true,
      items: true,
    },
    orderBy: (vo, { desc }) => [desc(vo.createdAt)],
  });
}
