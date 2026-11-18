import React from "react";
import { db, vendors } from "@/shared/db";
import { eq } from "drizzle-orm";
import { getVendorProducts } from "@/modules/catalog/product-service";
import { getVendorOrdersList } from "@/modules/order/checkout-service";
import { getVendorRevenueStats } from "@/modules/billing/billing-service";
import { VendorDashboardClient } from "@/components/vendor/VendorDashboardClient";

export const revalidate = 0; // Live dashboard

export default async function VendorDashboardPage() {
  // Find sample vendor "KeebCraft VN" or first active vendor
  let [vendor] = await db
    .select()
    .from(vendors)
    .where(eq(vendors.slug, "keebcraft-vn"));

  if (!vendor) {
    const list = await db.select().from(vendors);
    vendor = list[0];
  }

  if (!vendor) {
    return (
      <div className="py-16 text-center text-sm text-slate-500">
        Chưa có gian hàng nào được tạo. Vui lòng chạy seed hoặc đăng ký gian hàng mới!
      </div>
    );
  }

  const products = await getVendorProducts(vendor.id);
  const orders = await getVendorOrdersList(vendor.id);
  const stats = await getVendorRevenueStats(vendor.id);

  return (
    <VendorDashboardClient
      vendor={vendor}
      products={products}
      orders={orders}
      stats={stats}
    />
  );
}
