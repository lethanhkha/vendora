import React from "react";
import { getPublishedProducts, getCategories } from "@/modules/catalog/product-service";
import { SearchCatalogClient } from "@/components/search/SearchCatalogClient";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const initialQuery = params.q || "";

  const [products, categories] = await Promise.all([
    getPublishedProducts(),
    getCategories(),
  ]);

  return (
    <SearchCatalogClient
      initialProducts={products}
      initialQuery={initialQuery}
      categories={categories}
    />
  );
}
