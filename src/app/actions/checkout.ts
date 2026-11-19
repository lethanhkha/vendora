"use server";

import { processCheckout, CheckoutInput } from "@/modules/order/checkout-service";
import { confirmSandboxPayment } from "@/modules/billing/billing-service";
import { getOrCreateUser } from "@/modules/auth/auth-service";
import { getCurrentUser } from "@/app/actions/auth";
import { checkoutSchema } from "@/shared/validation/schemas";

export async function submitCheckoutAction(data: {
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  paymentMethod: "COD" | "SANDBOX" | "VIETQR";
  items: any[];
  voucherDiscount?: number;
  buyerEmail?: string;
}) {
  try {
    // 1. Zod DTO Input Validation and Sanitization
    const parseResult = checkoutSchema.safeParse(data);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || "Thông tin đơn hàng không hợp lệ.";
      return {
        success: false,
        error: firstError,
      };
    }

    const validatedData = parseResult.data;

    // 2. Resolve Buyer Profile (Logged-in User or Dedicated Guest Profile)
    const sessionUser = await getCurrentUser();
    let buyer = sessionUser;

    if (!buyer) {
      const cleanPhone = validatedData.recipientPhone.replace(/[^0-9]/g, "");
      const guestEmail =
        validatedData.buyerEmail ||
        `guest_${cleanPhone || Date.now().toString()}@guest.vendora.vn`;
      buyer = await getOrCreateUser(guestEmail, validatedData.recipientName);
    }

    const input: CheckoutInput = {
      buyerId: buyer.id,
      recipientName: validatedData.recipientName,
      recipientPhone: validatedData.recipientPhone,
      shippingAddress: validatedData.shippingAddress,
      paymentMethod: validatedData.paymentMethod,
      items: validatedData.items as any,
      voucherDiscount: validatedData.voucherDiscount,
    };

    const order = await processCheckout(input);

    // If sandbox mock payment selected, confirm payment
    if (validatedData.paymentMethod === "SANDBOX") {
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
