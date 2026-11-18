"use server";

import { processCheckout, CheckoutInput } from "@/modules/order/checkout-service";
import { confirmSandboxPayment } from "@/modules/billing/billing-service";
import { getOrCreateUser } from "@/modules/auth/auth-service";
import { getCurrentUser } from "@/app/actions/auth";

export async function submitCheckoutAction(data: {
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  paymentMethod: "COD" | "SANDBOX" | "VIETQR";
  items: any[];
  voucherDiscount?: number;
}) {
  try {
    const sessionUser = await getCurrentUser();
    const buyer = sessionUser || (await getOrCreateUser("buyer@vendora.vn", data.recipientName));

    const input: CheckoutInput = {
      buyerId: buyer.id,
      recipientName: data.recipientName,
      recipientPhone: data.recipientPhone,
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
      items: data.items,
      voucherDiscount: data.voucherDiscount,
    };

    const order = await processCheckout(input);

    // If sandbox mock payment selected, confirm payment
    if (data.paymentMethod === "SANDBOX") {
      await confirmSandboxPayment(order.id);
    }

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
    };
  } catch (error: any) {
    console.error("[submitCheckoutAction] Error:", error.message);
    return {
      success: false,
      error: error.message || "Đặt hàng thất bại. Vui lòng thử lại.",
    };
  }
}
