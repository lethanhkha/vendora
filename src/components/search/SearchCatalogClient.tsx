"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, SlidersHorizontal, ArrowUpDown, Check, X, 
  MapPin, ShieldCheck, Sparkles, Star, ChevronDown, RotateCcw
} from "lucide-react";
import { ProductCard } from "@/components/catalog/ProductCard";

interface SearchCatalogClientProps {
  initialProducts: any[];
  initialQuery?: string;
  categories: any[];
}

export function SearchCatalogClient({
  initialProducts,
  initialQuery = "",
  categories,
}: SearchCatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available locations
  const availableLocations = [
    { id: "Hà Nội", label: "Hà Nội", count: 8 },
    { id: "TP.HCM", label: "TP. Hồ Chí Minh", count: 6 },
    { id: "Đà Nẵng", label: "Đà Nẵng", count: 4 },
  ];

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
  };

  const toggleLocation = (loc: string) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((item) => item !== loc) : [...prev, loc]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setSelectedLocations([]);
    setVerifiedOnly(false);
    setInStockOnly(false);
    setFreeShippingOnly(false);
    setPriceRange([0, 10000000]);
    setSortBy("featured");
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        // Text Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchVendor = p.vendor.shopName.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchVendor) return false;
        }

        // Category
        if (selectedCategory !== "ALL" && p.category?.slug !== selectedCategory) {
          return false;
        }

        // Location
        if (selectedLocations.length > 0) {
          const matchLoc = selectedLocations.some((loc) =>
            p.vendor.location?.toLowerCase().includes(loc.toLowerCase())
          );
          if (!matchLoc) return false;
        }

        // Verified Artisan Badge
        if (verifiedOnly && !p.vendor.badge?.includes("Verified")) {
          return false;
        }

        // In Stock
        if (inStockOnly && (p.availableStock ?? 0) <= 0) {
          return false;
        }

        // Price range
        const priceNum = Number(p.price);
        if (priceNum < priceRange[0] || priceNum > priceRange[1]) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return Number(a.price) - Number(b.price);
        if (sortBy === "price-high") return Number(b.price) - Number(a.price);
        if (sortBy === "rating") return Number(b.vendor.rating) - Number(a.vendor.rating);
        return 0; // "featured" or default
      });
  }, [
    initialProducts,
    searchQuery,
    selectedCategory,
    selectedLocations,
    verifiedOnly,
    inStockOnly,
    priceRange,
    sortBy,
  ]);

  const activeFiltersCount =
    (selectedCategory !== "ALL" ? 1 : 0) +
    selectedLocations.length +
    (verifiedOnly ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (freeShippingOnly ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 10000000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="text-xs text-slate-400 mb-3 flex items-center gap-1.5">
            <Link href="/" className="hover:text-primary transition">Trang Chủ</Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">Tìm Kiếm & Khám Phá</span>
            {searchQuery && (
              <>
                <span>/</span>
                <span className="text-primary font-semibold truncate max-w-xs">&quot;{searchQuery}&quot;</span>
              </>
            )}
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                {searchQuery ? (
                  <>
                    Kết quả cho <span className="text-primary">&quot;{searchQuery}&quot;</span>
                  </>
                ) : (
                  "Tất Cả Sản Phẩm Chế Tác Độc Bản"
                )}
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-primary border border-indigo-100">
                  {filteredProducts.length} sản phẩm
                </span>
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Khám phá các xưởng thủ công độc lập và gom sản phẩm từ nhiều xưởng vào 1 giỏ hàng thanh toán.
              </p>
            </div>

            {/* Quick Sort & Mobile Filter Toggle */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <span>Bộ Lọc</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="relative flex items-center">
                <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                >
                  <option value="featured">Sắp xếp: Nổi Bật Nhất</option>
                  <option value="price-low">Giá: Thấp đến Cao</option>
                  <option value="price-high">Giá: Cao đến Thấp</option>
                  <option value="rating">Đánh Giá Xưởng Cao Nhất</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Quick Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex-shrink-0 ${
                selectedCategory === "ALL"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Tất Cả Danh Mục
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex-shrink-0 ${
                  selectedCategory === c.slug
                    ? "bg-primary text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Facet Filter Sidebar (w-64 desktop) */}
          <aside
            className={`md:col-span-4 lg:col-span-3 space-y-6 ${
              mobileFilterOpen ? "block" : "hidden md:block"
            }`}
          >
            <div className="bg-white rounded-2xl card-border p-5 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  <span className="font-extrabold text-slate-900 text-sm">Bộ Lọc Chi Tiết</span>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Đặt lại
                  </button>
                )}
              </div>

              {/* Keyword Search within Filters */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Tìm kiếm từ khóa</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tên phím, xưởng chế tác..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Price Range Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">Khoảng Giá (VNĐ)</label>
                  <span className="text-[11px] font-semibold text-primary">
                    {formatVND(priceRange[1])}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="100000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>0 ₫</span>
                  <span>10.000.000 ₫</span>
                </div>
              </div>

              {/* Studio Locations */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2.5">Vị Trí Xưởng Chế Tác</label>
                <div className="space-y-2">
                  {availableLocations.map((loc) => {
                    const checked = selectedLocations.includes(loc.id);
                    return (
                      <label
                        key={loc.id}
                        onClick={() => toggleLocation(loc.id)}
                        className="flex items-center justify-between text-xs text-slate-600 cursor-pointer hover:text-slate-900 group"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                              checked
                                ? "bg-primary border-primary text-white"
                                : "border-slate-300 group-hover:border-slate-400"
                            }`}
                          >
                            {checked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{loc.label}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">({loc.count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Artisan Seal & Quality */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2.5">Chứng Nhận Nghệ Nhân</label>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary cursor-pointer"
                    />
                    <span className="flex items-center gap-1 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-vendor-seal" /> Chỉ xưởng đã xác thực (Verified)
                    </span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary cursor-pointer"
                    />
                    <span className="font-medium">Chỉ sản phẩm còn hàng sẵn</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={freeShippingOnly}
                      onChange={(e) => setFreeShippingOnly(e.target.checked)}
                      className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary cursor-pointer"
                    />
                    <span className="font-medium">Giao nhanh &lt;24h từ xưởng</span>
                  </label>
                </div>
              </div>

              {/* Trust Box */}
              <div className="pt-4 border-t border-slate-100 bg-indigo-50/50 -mx-5 -mb-5 p-5 rounded-b-2xl">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">100% Escrow Protection</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      Tiền của bạn được Vendora tạm giữ an toàn trong 15 ngày, chỉ giải phóng khi bạn hoàn toàn hài lòng với tác phẩm.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Product Grid (col-span-8 or 9) */}
          <main className="md:col-span-8 lg:col-span-9">
            {/* Active Filters Bar */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-xs font-semibold text-slate-400">Đang lọc theo:</span>
                {selectedCategory !== "ALL" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">
                    Danh mục: {categories.find((c) => c.slug === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory("ALL")} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedLocations.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm"
                  >
                    Vị trí: {loc}
                    <button onClick={() => toggleLocation(loc)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {verifiedOnly && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-primary shadow-sm">
                    Xưởng đã xác thực
                    <button onClick={() => setVerifiedOnly(false)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700 shadow-sm">
                    Còn hàng
                    <button onClick={() => setInStockOnly(false)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-red-500 hover:underline font-bold ml-1"
                >
                  Xóa tất cả
                </button>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl card-border p-12 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Không tìm thấy sản phẩm phù hợp</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                  Thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt các bộ lọc để khám phá thêm nhiều sản phẩm khác.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-md hover:bg-primary-hover transition"
                >
                  Xóa Tất Cả Bộ Lọc
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
