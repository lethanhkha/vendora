import React from "react";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductReviews } from "@/modules/catalog/product-service";
import { ProductDetailClient } from "@/components/catalog/ProductDetailClient";

export const revalidate = 0;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const reviews = await getProductReviews(product.id);

  return <ProductDetailClient product={product} initialReviews={reviews} />;
}
