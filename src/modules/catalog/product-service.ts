import { db, products, productSkus, inventoryItems, vendors, categories, reviews, users } from "@/shared/db";
import { eq, desc, and } from "drizzle-orm";

export async function getPublishedProducts(categoryId?: string) {
  const query = db
    .select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      description: products.description,
      imageUrl: products.imageUrl,
      specs: products.specs,
      vendor: {
        id: vendors.id,
        shopName: vendors.shopName,
        slug: vendors.slug,
        logoUrl: vendors.logoUrl,
        badge: vendors.badge,
        location: vendors.location,
        rating: vendors.rating,
      },
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },
    })
    .from(products)
    .innerJoin(vendors, eq(products.vendorId, vendors.id))
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.status, "PUBLISHED"),
        eq(vendors.status, "ACTIVE"),
        categoryId ? eq(products.categoryId, categoryId) : undefined
      )
    )
    .orderBy(desc(products.createdAt));

  const list = await query;

  // Enrich each product with its primary SKU price and stock
  const enriched = await Promise.all(
    list.map(async (p) => {
      const skus = await db
        .select({
          id: productSkus.id,
          skuCode: productSkus.skuCode,
          price: productSkus.price,
          availableStock: inventoryItems.availableStock,
        })
        .from(productSkus)
        .leftJoin(inventoryItems, eq(productSkus.id, inventoryItems.skuId))
        .where(eq(productSkus.productId, p.id));

      const primarySku = skus[0] || null;
      return {
        ...p,
        price: primarySku ? primarySku.price : "0",
        primarySkuId: primarySku ? primarySku.id : null,
        availableStock: primarySku ? primarySku.availableStock ?? 0 : 0,
      };
    })
  );

  return enriched;
}

export async function getProductBySlug(slug: string) {
  const [product] = await db
    .select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      description: products.description,
      imageUrl: products.imageUrl,
      specs: products.specs,
      status: products.status,
      vendor: {
        id: vendors.id,
        shopName: vendors.shopName,
        slug: vendors.slug,
        logoUrl: vendors.logoUrl,
        badge: vendors.badge,
        location: vendors.location,
        rating: vendors.rating,
        description: vendors.description,
      },
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },
    })
    .from(products)
    .innerJoin(vendors, eq(products.vendorId, vendors.id))
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug));

  if (!product) return null;

  const skus = await db
    .select({
      id: productSkus.id,
      skuCode: productSkus.skuCode,
      price: productSkus.price,
      attributes: productSkus.attributes,
      availableStock: inventoryItems.availableStock,
    })
    .from(productSkus)
    .leftJoin(inventoryItems, eq(productSkus.id, inventoryItems.skuId))
    .where(eq(productSkus.productId, product.id));

  return {
    ...product,
    skus,
  };
}

export async function getVendorProducts(vendorId: string) {
  const items = await db
    .select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      imageUrl: products.imageUrl,
      status: products.status,
      categoryName: categories.name,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.vendorId, vendorId))
    .orderBy(desc(products.createdAt));

  const enriched = await Promise.all(
    items.map(async (item) => {
      const skus = await db
        .select({
          id: productSkus.id,
          skuCode: productSkus.skuCode,
          price: productSkus.price,
          attributes: productSkus.attributes,
          availableStock: inventoryItems.availableStock,
          reservedStock: inventoryItems.reservedStock,
        })
        .from(productSkus)
        .leftJoin(inventoryItems, eq(productSkus.id, inventoryItems.skuId))
        .where(eq(productSkus.productId, item.id));

      const primary = skus[0];
      return {
        ...item,
        price: primary ? primary.price : "0",
        primarySkuId: primary ? primary.id : null,
        availableStock: primary ? (primary.availableStock ?? 0) : 0,
        skus,
      };
    })
  );

  return enriched;
}

export type SkuInput = {
  skuCode: string;
  price: string;
  attributes?: Record<string, any>;
  stock: number;
};

export async function createProductWithSkuAndStock(input: {
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
  skus?: SkuInput[];
}) {
  return await db.transaction(async (tx) => {
    // 1. Insert product
    const [product] = await tx
      .insert(products)
      .values({
        vendorId: input.vendorId,
        categoryId: input.categoryId,
        title: input.title,
        slug: input.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        description: input.description,
        imageUrl: input.imageUrl,
        specs: input.specs || {},
        status: "PUBLISHED",
      })
      .returning();

    // Prepare list of SKUs to create
    const skusToCreate: SkuInput[] = input.skus && input.skus.length > 0
      ? input.skus
      : [
          {
            skuCode: input.skuCode || `SKU-${Date.now()}`,
            price: input.price || "0.00",
            stock: input.initialStock ?? 0,
            attributes: input.attributes || {},
          },
        ];

    const createdSkus = [];

    // 2. Insert all SKUs and their initial inventory
    for (const s of skusToCreate) {
      const [sku] = await tx
        .insert(productSkus)
        .values({
          productId: product.id,
          skuCode: s.skuCode,
          price: s.price,
          attributes: s.attributes || {},
        })
        .returning();

      await tx.insert(inventoryItems).values({
        skuId: sku.id,
        availableStock: s.stock,
        reservedStock: 0,
        version: 1,
      });

      createdSkus.push(sku);
    }

    return { product, skus: createdSkus, sku: createdSkus[0] };
  });
}

export async function getProductReviews(productId: string) {
  const list = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      craftRating: reviews.craftRating,
      reviewText: reviews.reviewText,
      images: reviews.images,
      isAnonymous: reviews.isAnonymous,
      createdAt: reviews.createdAt,
      buyerName: users.fullName,
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.buyerId, users.id))
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt));

  return list;
}

export async function getCategories() {
  return db.select().from(categories);
}
