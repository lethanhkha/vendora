import React from "react";
import { getCategories } from "@/modules/catalog/product-service";
import { getActiveVendors } from "@/modules/vendor/vendor-service";
import { ProductCreationClient } from "@/components/vendor/ProductCreationClient";

export default async function NewProductPage() {
  const [categories, vendorsList] = await Promise.all([
    getCategories(),
    getActiveVendors(),
  ]);

  const activeVendor = vendorsList[0] || null;

  return (
    <ProductCreationClient
      vendorId={activeVendor?.id || ""}
      categories={categories}
    />
  );
}
