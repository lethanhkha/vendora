"use server";

import { createVendorStore } from "@/modules/vendor/vendor-service";
import { getOrCreateUser } from "@/modules/auth/auth-service";
import { revalidatePath } from "next/cache";

export async function onboardVendorAction(data: {
  shopName: string;
  slug: string;
  description: string;
  location: string;
}) {
  try {
    // Generate or use user
    const user = await getOrCreateUser(
      `${data.slug}@vendora.vn`,
      `Chủ xưởng ${data.shopName}`
    );

    const vendor = await createVendorStore({
      userId: user.id,
      shopName: data.shopName,
      slug: data.slug,
      description: data.description,
      location: data.location,
    });

    revalidatePath("/");
    revalidatePath("/vendor/dashboard");

    return { success: true, vendor };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
