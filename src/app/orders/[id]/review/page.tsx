import React from "react";
import { getMasterOrderDetails } from "@/modules/order/checkout-service";
import { OrderReviewClient } from "@/components/order/OrderReviewClient";
import { notFound } from "next/navigation";

interface ReviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderReviewPage({ params }: ReviewPageProps) {
  const { id } = await params;
  const order = await getMasterOrderDetails(id);

  const subOrder = order?.vendorOrders?.[0];
  const item = subOrder?.items?.[0];
  const productId = item?.sku?.productId || "";
  const productTitle = item?.productTitle || "Bàn Phím Cơ Gỗ Óc Chó FAS 75%";

  return (
    <OrderReviewClient
      orderId={id}
      orderNumber={order?.orderNumber || "VND-9421"}
      productId={productId}
      vendorOrderId={subOrder?.id}
      productTitle={productTitle}
    />
  );
}
