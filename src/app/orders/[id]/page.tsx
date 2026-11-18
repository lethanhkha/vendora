import React from "react";
import { notFound } from "next/navigation";
import { getMasterOrderDetails } from "@/modules/order/checkout-service";
import { OrderSuccessTrackingClient } from "@/components/order/OrderSuccessTrackingClient";

export const revalidate = 0; // Dynamic server rendering for live tracking

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getMasterOrderDetails(id);

  if (!order) {
    notFound();
  }

  return <OrderSuccessTrackingClient order={order as any} />;
}
