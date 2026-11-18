import React from "react";
import { notFound } from "next/navigation";
import { getVendorBySlug } from "@/modules/vendor/vendor-service";
import { getVendorProducts } from "@/modules/catalog/product-service";
import { BoutiqueStorefrontClient } from "@/components/vendor/BoutiqueStorefrontClient";

export const revalidate = 0; // Dynamic server rendering for live inventory

export default async function VendorStorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vendor = await getVendorBySlug(slug);

  if (!vendor) {
    notFound();
  }

  const products = await getVendorProducts(vendor.id);

  return <BoutiqueStorefrontClient vendor={vendor} products={products} />;
}
