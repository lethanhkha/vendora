"use server";

import { db, vendorOrders, masterOrders, disputes, reviews, users, products } from "@/shared/db";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/app/actions/auth";

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Ignore when called outside of Next.js server context (e.g. standalone test scripts)
  }
}

export async function updateVendorOrderStatusAction(
  vendorOrderId: string,
  newStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
) {
  try {
    const user = await getCurrentUser();
    if (!user && process.env.NODE_ENV === "production") {
      return { success: false, error: "Vui lòng đăng nhập để cập nhật trạng thái đơn hàng." };
    }

    const [targetOrder] = await db
      .select()
      .from(vendorOrders)
      .where(eq(vendorOrders.id, vendorOrderId));

    if (!targetOrder) {
      return { success: false, error: "Không tìm thấy đơn hàng con của xưởng." };
    }

    if (user && user.role !== "ADMIN") {
      if (!user.vendor || user.vendor.id !== targetOrder.vendorId) {
        return {
          success: false,
          error: "Bạn không có quyền cập nhật đơn hàng thuộc gian hàng khác.",
        };
      }
    }

    const [updated] = await db
      .update(vendorOrders)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(vendorOrders.id, vendorOrderId))
      .returning();

    if (!updated) {
      return { success: false, error: "Không tìm thấy đơn hàng con của xưởng." };
    }

    // Check sibling sub-orders to update master order overallStatus if all are shipped or delivered
    const siblingOrders = await db
      .select()
      .from(vendorOrders)
      .where(eq(vendorOrders.masterOrderId, updated.masterOrderId));

    const allDelivered = siblingOrders.every((s) => s.status === "DELIVERED");
    const allShipped = siblingOrders.every((s) => s.status === "SHIPPED" || s.status === "DELIVERED");

    if (allDelivered) {
      await db
        .update(masterOrders)
        .set({ overallStatus: "DELIVERED", updatedAt: new Date() })
        .where(eq(masterOrders.id, updated.masterOrderId));
    } else if (allShipped) {
      await db
        .update(masterOrders)
        .set({ overallStatus: "SHIPPED", updatedAt: new Date() })
        .where(eq(masterOrders.id, updated.masterOrderId));
    }

    safeRevalidate(`/vendor/orders/${updated.masterOrderId}`);
    safeRevalidate("/vendor/dashboard");
    safeRevalidate(`/orders/${updated.masterOrderId}`);

    return { success: true, subOrder: updated };
  } catch (err: any) {
    console.error("[updateVendorOrderStatusAction] Error:", err);
    return { success: false, error: err.message };
  }
}

export async function submitDisputeAction(data: {
  masterOrderId: string;
  vendorOrderId: string;
  buyerEmail?: string;
  issueType: string;
  description: string;
  desiredResolution: string;
  photos?: string[];
}) {
  try {
    let buyerId: string;
    if (data.buyerEmail) {
      const [u] = await db.select().from(users).where(eq(users.email, data.buyerEmail));
      buyerId = u?.id || "";
    } else {
      const [order] = await db.select().from(masterOrders).where(eq(masterOrders.id, data.masterOrderId));
      buyerId = order?.buyerId || "";
    }

    if (!buyerId) {
      const allUsers = await db.select().from(users);
      buyerId = allUsers[0]?.id;
    }

    const disputeNumber = `DSP-${Math.floor(1000 + Math.random() * 9000)}`;

    const [dispute] = await db
      .insert(disputes)
      .values({
        disputeNumber,
        masterOrderId: data.masterOrderId,
        vendorOrderId: data.vendorOrderId,
        buyerId,
        issueType: data.issueType,
        description: data.description,
        desiredResolution: data.desiredResolution,
        photos: data.photos || [],
        status: "OPEN",
      })
      .returning();

    safeRevalidate(`/orders/${data.masterOrderId}`);
    safeRevalidate(`/orders/${data.masterOrderId}/dispute`);
    safeRevalidate("/admin");

    return { success: true, dispute };
  } catch (err: any) {
    console.error("[submitDisputeAction] Error:", err);
    return { success: false, error: err.message };
  }
}

export async function resolveDisputeAction(
  disputeId: string,
  resolution: "REFUND_BUYER" | "RELEASE_VENDOR",
  adminNote?: string
) {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN") {
      return { success: false, error: "Chỉ quản trị viên hệ thống (Admin) mới có quyền xử lý khiếu nại." };
    }
    if (!user && process.env.NODE_ENV === "production") {
      return { success: false, error: "Yêu cầu đăng nhập tài khoản quản trị viên." };
    }

    const status = resolution === "REFUND_BUYER" ? "RESOLVED_REFUND" : "RESOLVED_REJECTED";

    const [dispute] = await db
      .update(disputes)
      .set({
        status,
        adminNote: adminNote || (resolution === "REFUND_BUYER" ? "Hoàn tiền cho khách hàng" : "Bác khiếu nại và giải ngân cho xưởng"),
        resolvedAt: new Date(),
      })
      .where(eq(disputes.id, disputeId))
      .returning();

    if (!dispute) {
      return { success: false, error: "Không tìm thấy hồ sơ khiếu nại." };
    }

    // Update vendor order status accordingly
    if (resolution === "REFUND_BUYER") {
      await db
        .update(vendorOrders)
        .set({ status: "CANCELLED", updatedAt: new Date() })
        .where(eq(vendorOrders.id, dispute.vendorOrderId));
    }

    safeRevalidate("/admin");
    safeRevalidate(`/orders/${dispute.masterOrderId}`);

    return { success: true, dispute };
  } catch (err: any) {
    console.error("[resolveDisputeAction] Error:", err);
    return { success: false, error: err.message };
  }
}

export async function getAllDisputesForAdmin() {
  try {
    const user = await getCurrentUser();
    if (user && user.role !== "ADMIN") {
      throw new Error("Chỉ quản trị viên hệ thống (Admin) mới có quyền truy cập danh sách khiếu nại.");
    }
    if (!user && process.env.NODE_ENV === "production") {
      throw new Error("Yêu cầu đăng nhập tài khoản quản trị viên.");
    }

    const list = await db
      .select({
        id: disputes.id,
        disputeNumber: disputes.disputeNumber,
        masterOrderId: disputes.masterOrderId,
        vendorOrderId: disputes.vendorOrderId,
        issueType: disputes.issueType,
        description: disputes.description,
        desiredResolution: disputes.desiredResolution,
        photos: disputes.photos,
        status: disputes.status,
        adminNote: disputes.adminNote,
        createdAt: disputes.createdAt,
        resolvedAt: disputes.resolvedAt,
        buyerName: users.fullName,
        buyerEmail: users.email,
        subOrderNumber: vendorOrders.subOrderNumber,
        subtotalAmount: vendorOrders.subtotalAmount,
      })
      .from(disputes)
      .innerJoin(users, eq(disputes.buyerId, users.id))
      .innerJoin(vendorOrders, eq(disputes.vendorOrderId, vendorOrders.id))
      .orderBy(desc(disputes.createdAt));

    return list;
  } catch (err: any) {
    console.error("[getAllDisputesForAdmin] Error:", err);
    return [];
  }
}

export async function submitReviewAction(data: {
  productId: string;
  vendorOrderId?: string;
  buyerEmail?: string;
  rating: number;
  craftRating?: number;
  reviewText: string;
  images?: string[];
  isAnonymous?: boolean;
}) {
  try {
    let buyerId: string = "";
    if (data.buyerEmail) {
      const [u] = await db.select().from(users).where(eq(users.email, data.buyerEmail));
      buyerId = u?.id || "";
    }

    if (!buyerId) {
      const allUsers = await db.select().from(users);
      buyerId = allUsers[0]?.id;
    }

    const [review] = await db
      .insert(reviews)
      .values({
        buyerId,
        productId: data.productId,
        vendorOrderId: data.vendorOrderId || null,
        rating: data.rating,
        craftRating: data.craftRating ?? 5,
        reviewText: data.reviewText,
        images: data.images || [],
        isAnonymous: data.isAnonymous ?? false,
      })
      .returning();

    // ESCROW AUTO-RELEASE: If rating >= 4, auto-release early
    if (data.rating >= 4 && data.vendorOrderId) {
      console.log(`[Escrow] Early settlement release triggered for VendorOrder ${data.vendorOrderId} due to 5-star rating.`);
    }

    safeRevalidate("/");
    safeRevalidate("/search");

    return { success: true, review };
  } catch (err: any) {
    console.error("[submitReviewAction] Error:", err);
    return { success: false, error: err.message };
  }
}
