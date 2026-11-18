import React from "react";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { getAllDisputesForAdmin } from "@/app/actions/order-lifecycle";

export const revalidate = 0; // Live admin feed

export default async function AdminPage() {
  const dbDisputes = await getAllDisputesForAdmin();
  return <AdminDashboardClient initialDisputes={dbDisputes} />;
}
