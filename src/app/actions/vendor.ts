"use server";

import { updateSkuStock } from "@/modules/inventory/inventory-service";
import { createProductWithSkuAndStock } from "@/modules/catalog/product-service";
import { getCurrentUser } from "@/app/actions/auth";
import { db, products, productSkus } from "@/shared/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function adjustStockAction(skuId: string, delta: number) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Vui lòng đăng nhập để thực hiện thao tác này." };
    }

    // Role-based access & Tenant Isolation check
    if (user.role !== "ADMIN") {
      if (!user.vendor) {
        return { success: false, error: "Tài khoản của bạn chưa kích hoạt gian hàng người bán." };
      }

      const [skuOwner] = await db
        .select({ vendorId: products.vendorId })
        .from(productSkus)
        .innerJoin(products, eq(productSkus.productId, products.id))
        .where(eq(productSkus.id, skuId));

      if (!skuOwner || skuOwner.vendorId !== user.vendor.id) {
        return {
          success: false,
          error: "Bạn không có quyền can thiệp tồn kho của sản phẩm thuộc gian hàng khác.",
        };
      }
    }

    const updated = await updateSkuStock(skuId, delta);
    revalidatePath("/vendor/dashboard");
    revalidatePath("/");
    return { success: true, updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createProductAction(input: {
  vendorId?: string;
  categoryId: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  specs?: Record<string, any>;
  price?: string;
  skuCode?: string;
  initialStock?: number;
  attributes?: Record<string, any>;
  skus?: Array<{
    skuCode: string;
    price: string;
    attributes?: Record<string, any>;
    stock: number;
  }>;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Vui lòng đăng nhập để đăng tải tác phẩm." };
    }

    let targetVendorId = input.vendorId;

    // Strict Tenant Isolation: Non-admin vendors can only create products for their own store
    if (user.role !== "ADMIN") {
      if (!user.vendor) {
        return { success: false, error: "Tài khoản của bạn chưa kích hoạt gian hàng người bán." };
      }
      targetVendorId = user.vendor.id;
    } else {
      targetVendorId = targetVendorId || user.vendor?.id;
    }

    if (!targetVendorId) {
      return { success: false, error: "Không xác định được gian hàng mục tiêu để tạo sản phẩm." };
    }

    const result = await createProductWithSkuAndStock({
      ...input,
      vendorId: targetVendorId,
    });

    revalidatePath("/vendor/dashboard");
    revalidatePath("/search");
    revalidatePath("/");
    return { success: true, product: result.product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
