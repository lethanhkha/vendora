import React from "react";
import { getMasterOrderDetails } from "@/modules/order/checkout-service";
import { VendorOrderDetailClient } from "@/components/vendor/VendorOrderDetailClient";

interface VendorOrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function VendorOrderPage({ params }: VendorOrderPageProps) {
  const { id } = await params;
  const order = await getMasterOrderDetails(id);

  const subOrder = order?.vendorOrders?.[0];

  return (
    <VendorOrderDetailClient
      orderId={id}
      subOrderId={subOrder?.id}
      orderNumber={order?.orderNumber || "VND-9421"}
      subOrderNumber={subOrder?.subOrderNumber || "VND-9421-A"}
      recipientName={order?.recipientName || "Nguyễn Văn An"}
      recipientPhone={order?.recipientPhone || "0987 654 321"}
      shippingAddress={order?.shippingAddress || "Số 18, Ngõ 92 Phố Trúc Khê, Láng Hạ, Đống Đa, Hà Nội"}
      subtotal={
        subOrder?.subtotalAmount
          ? new Intl.NumberFormat("vi-VN").format(Number(subOrder.subtotalAmount)) + " ₫"
          : "1.850.000 ₫"
      }
      shippingFee={
        subOrder?.shippingFee
          ? new Intl.NumberFormat("vi-VN").format(Number(subOrder.shippingFee)) + " ₫"
          : "35.000 ₫"
      }
    />
  );
}
