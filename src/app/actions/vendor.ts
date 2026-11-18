"use server";

import { updateSkuStock } from "@/modules/inventory/inventory-service";
import { createProductWithSkuAndStock } from "@/modules/catalog/product-service";
import { revalidatePath } from "next/cache";

export async function adjustStockAction(skuId: string, delta: number) {
  try {
    const updated = await updateSkuStock(skuId, delta);
    revalidatePath("/vendor/dashboard");
    revalidatePath("/");
    return { success: true, updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createProductAction(input: {
  vendorId: string;
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
    const result = await createProductWithSkuAndStock(input);
    revalidatePath("/vendor/dashboard");
    revalidatePath("/search");
    revalidatePath("/");
    return { success: true, product: result.product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
