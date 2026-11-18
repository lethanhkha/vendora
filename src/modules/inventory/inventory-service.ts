import { db, inventoryItems } from "@/shared/db";
import { eq, sql } from "drizzle-orm";
import { eventBus, OrderCreatedPayload } from "@/shared/events/event-bus";

// Register Domain Event Listener for OrderCreatedEvent
eventBus.subscribe<OrderCreatedPayload>("OrderCreatedEvent", async (event) => {
  console.log(`[InventoryModule] 📦 Received OrderCreatedEvent for MasterOrder ${event.payload.orderNumber}`);

  const vendorOrders = event.payload.vendorOrders;

  for (const vo of vendorOrders) {
    for (const item of vo.items) {
      // Atomic stock decrement with version increment
      const updated = await db
        .update(inventoryItems)
        .set({
          availableStock: sql`${inventoryItems.availableStock} - ${item.quantity}`,
          reservedStock: sql`${inventoryItems.reservedStock} + ${item.quantity}`,
          version: sql`${inventoryItems.version} + 1`,
          updatedAt: new Date(),
        })
        .where(
          sql`${inventoryItems.skuId} = ${item.skuId} AND ${inventoryItems.availableStock} >= ${item.quantity}`
        )
        .returning();

      if (updated.length === 0) {
        throw new Error(
          `Hết hàng: Sản phẩm "${item.productTitle}" không đủ số lượng tồn kho khả dụng!`
        );
      }

      console.log(
        `[InventoryModule] ✅ Deducted ${item.quantity} units for SKU ${item.skuId}. Remaining: ${updated[0].availableStock}`
      );
    }
  }
});

// Inline Stock update for Vendor Studio Dashboard
export async function updateSkuStock(skuId: string, delta: number) {
  const [updated] = await db
    .update(inventoryItems)
    .set({
      availableStock: sql`GREATEST(0, ${inventoryItems.availableStock} + ${delta})`,
      version: sql`${inventoryItems.version} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(inventoryItems.skuId, skuId))
    .returning();

  return updated;
}

export async function getInventoryBySkuId(skuId: string) {
  const [record] = await db
    .select()
    .from(inventoryItems)
    .where(eq(inventoryItems.skuId, skuId));
  return record || null;
}
