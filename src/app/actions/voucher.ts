"use server";

import { db, vouchers } from "@/shared/db";
import { eq, and } from "drizzle-orm";

export async function validateVoucherAction(code: string, subtotal: number) {
  if (!code || !code.trim()) {
    return { success: false, error: "Vui lòng nhập mã giảm giá." };
  }

  const cleanCode = code.trim().toUpperCase();

  try {
    const [voucher] = await db
      .select()
      .from(vouchers)
      .where(and(eq(vouchers.code, cleanCode), eq(vouchers.isActive, true)));

    if (!voucher) {
      return { success: false, error: `Mã giảm giá "${cleanCode}" không tồn tại hoặc đã hết hạn.` };
    }

    const minAmount = Number(voucher.minOrderAmount);
    if (subtotal < minAmount) {
      return {
        success: false,
        error: `Mã "${cleanCode}" yêu cầu đơn hàng tối thiểu ${new Intl.NumberFormat("vi-VN").format(minAmount)} ₫.`,
      };
    }

    let discountAmount = 0;
    if (voucher.discountType === "PERCENTAGE") {
      discountAmount = Math.round((subtotal * Number(voucher.discountValue)) / 100);
    } else {
      discountAmount = Math.min(Number(voucher.discountValue), subtotal);
    }

    return {
      success: true,
      code: voucher.code,
      title: voucher.title,
      discountAmount,
    };
  } catch (err: any) {
    console.error("[validateVoucherAction] Error:", err);
    return { success: false, error: "Lỗi hệ thống khi kiểm tra voucher." };
  }
}
