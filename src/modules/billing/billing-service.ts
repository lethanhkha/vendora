import { db, masterOrders, vendorOrders } from "@/shared/db";
import { eq } from "drizzle-orm";

export async function confirmSandboxPayment(masterOrderId: string) {
  // Update Master Order
  const [updatedMaster] = await db
    .update(masterOrders)
    .set({
      paymentStatus: "PAID",
      overallStatus: "PROCESSING",
      updatedAt: new Date(),
    })
    .where(eq(masterOrders.id, masterOrderId))
    .returning();

  // Cascade to Sub-Orders
  await db
    .update(vendorOrders)
    .set({
      status: "PROCESSING",
      updatedAt: new Date(),
    })
    .where(eq(vendorOrders.masterOrderId, masterOrderId));

  return updatedMaster;
}

export async function getVendorRevenueStats(vendorId: string) {
  const subOrders = await db
    .select({
      subtotal: vendorOrders.subtotalAmount,
      status: vendorOrders.status,
    })
    .from(vendorOrders)
    .where(eq(vendorOrders.vendorId, vendorId));

  const totalRevenue = subOrders.reduce((sum, order) => {
    return sum + (order.status !== "CANCELLED" ? parseFloat(order.subtotal) : 0);
  }, 0);

  const pendingOrdersCount = subOrders.filter((o) => o.status === "PENDING" || o.status === "PROCESSING").length;

  return {
    totalRevenue,
    orderCount: subOrders.length,
    pendingOrdersCount,
  };
}
