import React from "react";
import { getBuyerOrdersList } from "@/modules/order/checkout-service";
import { BuyerAccountClient } from "@/components/account/BuyerAccountClient";

export const revalidate = 0; // Dynamic server rendering for live orders

export default async function BuyerOrdersPage() {
  const orders = await getBuyerOrdersList();

  return <BuyerAccountClient orders={orders as any} />;
}
