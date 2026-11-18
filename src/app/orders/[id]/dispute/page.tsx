import React from "react";
import { getMasterOrderDetails } from "@/modules/order/checkout-service";
import { OrderDisputeClient } from "@/components/order/OrderDisputeClient";

interface DisputePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDisputePage({ params }: DisputePageProps) {
  const { id } = await params;
  const order = await getMasterOrderDetails(id);

  const subOrder = order?.vendorOrders?.[0];
  const subOrderNumber = subOrder?.subOrderNumber || "VND-9421-A";
  const amount = subOrder?.subtotalAmount
    ? new Intl.NumberFormat("vi-VN").format(Number(subOrder.subtotalAmount)) + " ₫"
    : "1.850.000 ₫";

  return (
    <OrderDisputeClient
      orderId={id}
      vendorOrderId={subOrder?.id}
      orderNumber={order?.orderNumber || "VND-9421"}
      subOrderNumber={subOrderNumber}
      amount={amount}
    />
  );
}
