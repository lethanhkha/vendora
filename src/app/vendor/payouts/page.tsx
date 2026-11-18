import React from "react";
import { db, vendors } from "@/shared/db";
import { eq } from "drizzle-orm";
import { getVendorPayoutLedger } from "@/modules/billing/commission-service";
import { VendorPayoutsClient } from "@/components/vendor/VendorPayoutsClient";

export const revalidate = 0; // Live payout ledger

export default async function VendorPayoutsPage() {
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
        Chưa có gian hàng nào được tạo.
      </div>
    );
  }

  const ledgerData = await getVendorPayoutLedger(vendor.id);

  return <VendorPayoutsClient vendor={vendor} ledgerData={ledgerData} />;
}
