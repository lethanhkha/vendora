import { db, vendorOrders, masterOrders, orderItems } from "@/shared/db";
import { eq, desc } from "drizzle-orm";

export const PLATFORM_COMMISSION_PERCENT = 5; // 5% default marketplace take-rate

export interface CommissionBreakdown {
  grossAmount: number;
  commissionRate: number;      // e.g. 0.05
  commissionAmount: number;    // e.g. 50,000 ₫
  netVendorAmount: number;     // e.g. 950,000 ₫
}

/**
 * Tính toán hoa hồng sàn và số tiền thực nhận của xưởng
 */
export function calculateCommission(
  grossAmount: number | string,
  ratePercent: number = PLATFORM_COMMISSION_PERCENT
): CommissionBreakdown {
  const gross = Math.max(0, Number(grossAmount));
  const rate = ratePercent / 100;
  const commission = Math.round(gross * rate);
  const net = gross - commission;

  return {
    grossAmount: gross,
    commissionRate: rate,
    commissionAmount: commission,
    netVendorAmount: net,
  };
}

/**
 * Lấy sổ cái quyết toán & đối soát ký quỹ động cho Vendor
 */
export async function getVendorPayoutLedger(vendorId: string) {
  const subOrders = await db
    .select({
      id: vendorOrders.id,
      subOrderNumber: vendorOrders.subOrderNumber,
      subtotalAmount: vendorOrders.subtotalAmount,
      shippingFee: vendorOrders.shippingFee,
      status: vendorOrders.status,
      createdAt: vendorOrders.createdAt,
      masterOrderNumber: masterOrders.orderNumber,
      paymentStatus: masterOrders.paymentStatus,
    })
    .from(vendorOrders)
    .innerJoin(masterOrders, eq(vendorOrders.masterOrderId, masterOrders.id))
    .where(eq(vendorOrders.vendorId, vendorId))
    .orderBy(desc(vendorOrders.createdAt));

  let totalGross = 0;
  let totalCommission = 0;
  let totalNet = 0;
  let escrowHolding = 0;
  let availablePayout = 0;

  const records = subOrders.map((so) => {
    const gross = Number(so.subtotalAmount);
    const breakdown = calculateCommission(gross);

    totalGross += breakdown.grossAmount;
    totalCommission += breakdown.commissionAmount;
    totalNet += breakdown.netVendorAmount;

    // Escrow logic: If DELIVERED or PAID, funds are released; if PENDING/PROCESSING/SHIPPED, held in escrow
    const isReleased = so.status === "DELIVERED";
    if (isReleased) {
      availablePayout += breakdown.netVendorAmount;
    } else if (so.status !== "CANCELLED") {
      escrowHolding += breakdown.netVendorAmount;
    }

    // Escrow release date: 15 days from creation
    const releaseDate = new Date(so.createdAt);
    releaseDate.setDate(releaseDate.getDate() + 15);

    return {
      id: so.id,
      subOrderNumber: so.subOrderNumber || `SUB-${so.id.slice(0, 8)}`,
      date: new Date(so.createdAt).toLocaleDateString("vi-VN"),
      gross: breakdown.grossAmount,
      fee: breakdown.commissionAmount,
      net: breakdown.netVendorAmount,
      escrowReleaseDate: releaseDate.toLocaleDateString("vi-VN"),
      status: isReleased ? "AVAILABLE" : so.status === "CANCELLED" ? "CANCELLED" : "ESCROW_PENDING",
      statusLabel: isReleased
        ? "Khả Dụng (Đã Release)"
        : so.status === "CANCELLED"
        ? "Đã Hủy"
        : "Tạm Giữ Ký Quỹ (15 Ngày)",
    };
  });

  return {
    totalGross,
    totalCommission,
    totalNet,
    escrowHolding,
    availablePayout,
    records,
  };
}
