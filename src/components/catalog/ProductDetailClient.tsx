"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, ShieldCheck, Truck, CheckCircle2, ShoppingBag, MessageSquare, Store, Check } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

export function ProductDetailClient({ 
  product, 
  initialReviews = [] 
}: { 
  product: any; 
  initialReviews?: any[]; 
}) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedSkuIndex, setSelectedSkuIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedSku = product.skus[selectedSkuIndex] || product.skus[0];
  const stock = selectedSku?.availableStock ?? 0;

  const reviewsCount = initialReviews.length;
  const avgRating = reviewsCount > 0
    ? (initialReviews.reduce((acc, r) => acc + Number(r.rating || 5), 0) / reviewsCount).toFixed(1)
    : "5.0";

  const formatVND = (price: string | number) => {
    return new Intl.NumberFormat("vi-VN").format(Number(price)) + " ₫";
  };

  const handleAddToCart = () => {
    addToCart({
      skuId: selectedSku.id,
      productId: product.id,
      productTitle: product.title,
      productSlug: product.slug,
      imageUrl: product.imageUrl,
      price: selectedSku.price,
      quantity,
      attributes: selectedSku.attributes,
      vendorId: product.vendor.id,
      vendorName: product.vendor.shopName,
      vendorSlug: product.vendor.slug,
      vendorLocation: product.vendor.location,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-primary">Trang chủ</Link>
        <span>/</span>
        <span>{product.category.name}</span>
        <span>/</span>
        <span className="text-dark font-semibold truncate">{product.title}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl card-border p-6 sm:p-10">
        {/* Left: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 card-border">
            <Image
              src={product.imageUrl || "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80"}
              alt={product.title}
              fill
              priority
              className="object-cover"
            />
            {stock <= 5 && stock > 0 && (
              <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Chỉ còn {stock} chiếc trong đợt chế tác này
              </span>
            )}
          </div>

          {/* Thumbnail list */}
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-xl overflow-hidden relative card-border ring-2 ring-primary">
              <Image
                src={product.imageUrl}
                alt="Thumbnail"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            {/* Vendor Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-xs font-bold text-vendor-seal mb-3">
              <Store className="w-3.5 h-3.5" />
              <span>Gian hàng: {product.vendor.shopName}</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight leading-snug">
              {product.title}
            </h1>

            {/* Ratings & Sold */}
            <div className="flex items-center gap-3 mt-2.5 text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.vendor.rating}</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">128 đánh giá thực tế</span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-600 font-semibold">Bảo hành 24 tháng</span>
            </div>

            {/* Price block */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-50 card-border flex items-baseline gap-3">
              <span className="text-3xl font-black text-dark tracking-tight">
                {formatVND(selectedSku?.price || "0")}
              </span>
              <span className="text-xs text-slate-400 line-through">
                {formatVND(Number(selectedSku?.price || 0) * 1.15)}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Tiết kiệm 15%
              </span>
            </div>

            {/* SKU Variant Selectors */}
            {product.skus.length > 1 && (
              <div className="mt-6 space-y-2">
                <label className="text-xs font-bold text-slate-700">Tùy Chọn Phân Loại (SKU):</label>
                <div className="flex flex-wrap gap-2">
                  {product.skus.map((sku: any, index: number) => (
                    <button
                      key={sku.id}
                      onClick={() => setSelectedSkuIndex(index)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        selectedSkuIndex === index
                          ? "bg-dark text-white shadow-sm ring-2 ring-dark"
                          : "bg-white card-border text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {sku.skuCode} ({sku.availableStock} còn)
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6 flex items-center gap-4">
              <label className="text-xs font-bold text-slate-700">Số lượng:</label>
              <div className="flex items-center card-border rounded-xl bg-white overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-sm font-bold text-slate-500 hover:bg-slate-50 transition"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-dark">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                  className="px-3 py-1.5 text-sm font-bold text-slate-500 hover:bg-slate-50 transition"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-slate-400">Kho xưởng: {stock} sản phẩm khả dụng</span>
            </div>

            {/* Action CTAs */}
            <div className="mt-8 grid grid-cols-2 gap-3.5">
              <button
                onClick={handleAddToCart}
                disabled={stock <= 0}
                className={`py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-sm ${
                  added
                    ? "bg-emerald-600 text-white"
                    : "bg-primary hover:bg-primary-hover text-white active:scale-98"
                } disabled:bg-slate-300 disabled:cursor-not-allowed`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Đã Thêm Vào Giỏ</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Thêm Vào Giỏ</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={stock <= 0}
                className="py-3.5 px-4 rounded-xl font-bold text-sm bg-dark hover:bg-slate-800 text-white flex items-center justify-center gap-2 transition active:scale-98 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Mua Ngay (Escrow)
              </button>
            </div>
          </div>

          {/* Maker / Vendor Profile Card */}
          <div className="p-4 rounded-2xl bg-slate-50 card-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden relative bg-slate-200">
                <Image
                  src={product.vendor.logoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                  alt={product.vendor.shopName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h4 className="text-xs font-bold text-dark">{product.vendor.shopName}</h4>
                  <CheckCircle2 className="w-3.5 h-3.5 text-vendor-seal" />
                </div>
                <p className="text-[11px] text-slate-500">{product.vendor.location} • 99% phản hồi</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl bg-white card-border text-slate-600 hover:text-primary transition">
                <MessageSquare className="w-4 h-4" />
              </button>
              <Link
                href={`/store/${product.vendor.slug}`}
                className="px-3.5 py-1.5 rounded-xl bg-white card-border text-xs font-bold text-slate-700 hover:text-primary transition"
              >
                Ghé Studio
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description & Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-3xl card-border p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-dark pb-3 border-b border-slate-100">
            Mô Tả Sản Phẩm Từ Nghệ Nhân
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>

          {/* Specs Table */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-dark">Thông Số Kỹ Thuật Chi Tiết</h3>
              <div className="rounded-xl overflow-hidden card-border divide-y divide-slate-100 text-xs">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 p-3 bg-white">
                    <span className="font-semibold text-slate-500 capitalize">{key}</span>
                    <span className="col-span-2 text-dark font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Guarantees Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl card-border p-6 space-y-4">
            <h3 className="text-sm font-bold text-dark flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Chính Sách Bảo Vệ Mua Hàng</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <p>Giao trực tiếp từ xưởng xấp xỉ 2 ngày làm việc.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p>Ký quỹ 15 ngày: Đổi trả và hoàn tiền 100% nếu sản phẩm có lỗi từ nhà sản xuất.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl card-border p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-dark flex items-center gap-2">
              <span>Đánh Giá Từ Khách Hàng Thực Tế</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-primary font-bold">
                {reviewsCount} đánh giá
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Phản hồi từ các nhà sưu tầm và khách mua hàng đã nhận sản phẩm thực tế
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-black text-amber-900">{avgRating}</span>
              <span className="text-xs text-amber-700">/ 5.0</span>
            </div>
          </div>
        </div>

        {reviewsCount === 0 ? (
          <div className="py-10 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-700">Chưa có đánh giá nào cho sản phẩm này.</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Khi mua tác phẩm và nhận kiện hàng hoàn tất, bạn có thể gửi phản hồi để nhận ngay voucher 50.000 ₫ cho đơn kế tiếp.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {initialReviews.map((rev) => (
              <div key={rev.id} className="py-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                      {rev.isAnonymous ? "Ẩn" : (rev.buyerName?.[0] || "U")}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-dark block">
                        {rev.isAnonymous ? "Khách hàng ẩn danh" : (rev.buyerName || "Người mua đã xác thực")}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString("vi-VN")} &bull; Đã xác minh mua hàng
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">{rev.reviewText}</p>

                {Array.isArray(rev.images) && rev.images.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    {rev.images.map((imgUrl: string, idx: number) => (
                      <div key={idx} className="w-14 h-14 rounded-lg overflow-hidden relative card-border">
                        <Image src={imgUrl} alt="Review photo" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
