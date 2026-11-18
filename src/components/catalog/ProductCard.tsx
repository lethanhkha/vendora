"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

export function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const formatVND = (price: string | number) => {
    return new Intl.NumberFormat("vi-VN").format(Number(price)) + " ₫";
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      skuId: product.primarySkuId || product.id,
      productId: product.id,
      productTitle: product.title,
      productSlug: product.slug,
      imageUrl: product.imageUrl,
      price: product.price,
      quantity: 1,
      vendorId: product.vendor.id,
      vendorName: product.vendor.shopName,
      vendorSlug: product.vendor.slug,
      vendorLocation: product.vendor.location,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="group bg-surface rounded-2xl hairline-border p-4 flex flex-col justify-between hover-lift">
      <div>
        {/* Vendor Attribution Bar */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 hairline-b">
          <Link
            href={`/store/${product.vendor.slug}`}
            className="flex items-center gap-2 min-w-0 group/vendor"
          >
            <div className="w-5 h-5 rounded-full overflow-hidden bg-canvas-warm flex-shrink-0 relative hairline-border">
              <Image
                src={product.vendor.logoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                alt={product.vendor.shopName}
                fill
                sizes="20px"
                className="object-cover"
              />
            </div>
            <span className="text-xs font-medium text-ink-secondary truncate group-hover/vendor:text-ink transition-[color] duration-200">
              {product.vendor.shopName}
            </span>
          </Link>
          <span className="text-[11px] text-ink-muted flex-shrink-0">
            {product.vendor.location?.split(",")[0]}
          </span>
        </div>

        {/* Product Image Frame */}
        <Link 
          href={`/products/${product.slug}`} 
          className="block relative aspect-square rounded-xl overflow-hidden bg-canvas-warm mb-3.5 image-zoom-frame"
        >
          <Image
            src={product.imageUrl || "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover"
          />
          {product.availableStock <= 5 && product.availableStock > 0 && (
            <span className="absolute bottom-2.5 left-2.5 bg-ink text-surface text-[10px] font-medium px-2 py-0.5 rounded-md shadow-subtle">
              Còn {product.availableStock} chiếc
            </span>
          )}
        </Link>

        {/* Category */}
        <p className="text-[11px] font-medium text-ink-muted mb-1 tracking-wide">
          {product.category?.name}
        </p>

        {/* Title */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-ink line-clamp-2 hover:text-terracotta transition-[color] duration-200 leading-snug">
            {product.title}
          </h3>
        </Link>
      </div>

      {/* Price & Add to Cart Action */}
      <div className="mt-5 pt-3.5 hairline-t flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-ink-muted block font-medium">Giá chế tác</span>
          <p className="text-base font-semibold text-ink tracking-tight tabular-nums">
            {formatVND(product.price)}
          </p>
        </div>

        <button
          onClick={handleAdd}
          aria-label={`Thêm ${product.title} vào giỏ hàng`}
          className={`tactile-button flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer ${
            added
              ? "bg-emerald-700 text-white shadow-subtle"
              : "bg-ink hover:bg-ink-secondary text-white shadow-subtle hover:shadow-elevate"
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Đã thêm</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Thêm vào giỏ</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
