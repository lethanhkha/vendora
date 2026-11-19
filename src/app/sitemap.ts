import { MetadataRoute } from "next";
import { db, products, vendors } from "@/shared/db";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vendora.vn";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vendor/onboarding`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  try {
    const publishedProducts = await db
      .select({
        slug: products.slug,
        updatedAt: products.updatedAt,
        createdAt: products.createdAt,
      })
      .from(products)
      .where(eq(products.status, "PUBLISHED"));

    const productRoutes: MetadataRoute.Sitemap = publishedProducts.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: p.updatedAt || p.createdAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    const activeVendors = await db
      .select({
        slug: vendors.slug,
        updatedAt: vendors.updatedAt,
        createdAt: vendors.createdAt,
      })
      .from(vendors)
      .where(eq(vendors.status, "ACTIVE"));

    const vendorRoutes: MetadataRoute.Sitemap = activeVendors.map((v) => ({
      url: `${baseUrl}/store/${v.slug}`,
      lastModified: v.updatedAt || v.createdAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    }));

    return [...staticRoutes, ...productRoutes, ...vendorRoutes];
  } catch (error) {
    console.error("[Sitemap Generation Failed]:", error);
    return staticRoutes;
  }
}
