import { db, vendors, users } from "@/shared/db";
import { eq } from "drizzle-orm";

export type CreateVendorInput = {
  userId: string;
  shopName: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  location?: string;
};

export async function createVendorStore(input: CreateVendorInput) {
  // Check if user already owns a vendor shop
  const [existing] = await db
    .select()
    .from(vendors)
    .where(eq(vendors.userId, input.userId));

  if (existing) {
    throw new Error("Người dùng này đã sở hữu một gian hàng");
  }

  // Auto-activate vendor store (status: 'ACTIVE') as requested, keeping enum for admin control
  const [vendor] = await db
    .insert(vendors)
    .values({
      userId: input.userId,
      shopName: input.shopName,
      slug: input.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      description: input.description,
      logoUrl: input.logoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      location: input.location || "Hà Nội",
      badge: "Verified Merchant",
      status: "ACTIVE", // Auto-activated
    })
    .returning();

  // Upgrade user's role to VENDOR
  await db
    .update(users)
    .set({ role: "VENDOR" })
    .where(eq(users.id, input.userId));

  return vendor;
}

export async function getVendorByUserId(userId: string) {
  const [vendor] = await db
    .select()
    .from(vendors)
    .where(eq(vendors.userId, userId));
  return vendor || null;
}

export async function getVendorBySlug(slug: string) {
  const [vendor] = await db
    .select()
    .from(vendors)
    .where(eq(vendors.slug, slug));
  return vendor || null;
}

export async function getActiveVendors() {
  return db
    .select()
    .from(vendors)
    .where(eq(vendors.status, "ACTIVE"));
}
