"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Store, User, ShieldCheck, Package, ArrowRight } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

const SEARCH_SUGGESTIONS = [
  { type: "product", title: "Bàn Phím Cơ Gỗ Óc Chó FAS 75%", subtitle: "KeebCraft VN • 1.850.000 ₫", href: "/products/ban-phim-co-go-oc-cho-fas-75" },
  { type: "product", title: "Tấm Lót Bàn Da Bò Sáp Ý 90x40", subtitle: "Aura Saigon Leather • 450.000 ₫", href: "/products/tam-lot-ban-da-bo-sap-y-90x40" },
  { type: "product", title: "Bình Gốm Men Hỏa Biến Sa Mạc", subtitle: "Gốm Bát Tràng Atelier • 680.000 ₫", href: "/products/binh-gom-men-hoa-bien-sa-mac" },
  { type: "product", title: "Tai Nghe Studio Monitor Bluetooth Pro", subtitle: "KeebCraft VN • 2.450.000 ₫", href: "/products/tai-nghe-studio-monitor-bluetooth-pro" },
  { type: "store", title: "KeebCraft VN", subtitle: "Xưởng bàn phím cơ Ba Đình, Hà Nội", href: "/store/keebcraft-vn" },
  { type: "store", title: "Aura Saigon Leather", subtitle: "Đồ da thảo mộc Q.1, TP.HCM", href: "/store/aura-saigon-leather" },
  { type: "store", title: "Gốm Bát Tràng Atelier", subtitle: "Nghệ thuật men hỏa biến Gia Lâm, Hà Nội", href: "/store/battrang-atelier" },
];

export function Header() {
  const { summary } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === "Escape") {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredSuggestions = SEARCH_SUGGESTIONS.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Announcement Bar */}
      <div className="bg-ink text-surface-warm text-xs py-2 px-4 flex items-center justify-between font-normal">
        <div className="flex items-center space-x-2 mx-auto sm:mx-0">
          <span className="bg-surface/10 px-2 py-0.5 rounded text-[10px] font-medium tracking-wide">
            VENDORA
          </span>
          <span className="text-ink-faint">
            Miễn phí giao hàng gom đơn từ <strong>800.000 ₫</strong> &bull; Bảo hộ ký quỹ an tâm 15 ngày
          </span>
        </div>
        <div className="hidden sm:flex items-center space-x-5 text-ink-faint text-xs">
          <span className="flex items-center gap-1.5 text-surface-warm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Ký quỹ Escrow 15 ngày
          </span>
          <span>Hotline: 1900 8888</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="glass-header px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-ink flex items-center justify-center text-surface shadow-subtle group-hover:scale-105 transition-transform duration-300">
              <span className="font-bold text-sm tracking-tighter">V</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-ink">
                Vendora
              </span>
              <span className="text-[10px] text-ink-muted border-l hairline-border pl-2 font-medium">
                Atelier
              </span>
            </div>
          </Link>

          {/* Search Trigger Button with Shortcut */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="w-full pl-10 pr-12 py-2.5 rounded-xl hairline-border bg-surface text-sm text-left text-ink-muted hover:border-hairline-hover focus:outline-none transition-[border-color] duration-200 relative cursor-pointer"
            >
              <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-3" />
              <span>Tìm kiếm tác phẩm gốm, bàn phím cơ, đồ da mộc...</span>
              <span className="absolute right-3 top-2.5 px-1.5 py-0.5 rounded bg-canvas-warm text-[10px] font-medium text-ink-secondary hairline-border">
                ⌘K
              </span>
            </button>
          </div>

          {/* Action Links & Cart */}
          <div className="flex items-center gap-3">
            {/* Buyer Orders Quick Link */}
            <Link
              href="/account/orders"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-ink-secondary hover:text-ink rounded-lg hover:bg-canvas-warm transition-[background-color,color] duration-200"
            >
              <Package className="w-4 h-4 text-ink-secondary" />
              <span>Đơn mua</span>
            </Link>

            {/* Vendor Portal Link */}
            <Link
              href="/vendor/dashboard"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-ink-secondary hover:text-ink rounded-lg hover:bg-canvas-warm transition-[background-color,color] duration-200"
            >
              <Store className="w-4 h-4 text-ink-secondary" />
              <span>Kênh xưởng</span>
            </Link>

            {/* Become a Vendor CTA */}
            <Link
              href="/vendor/onboarding"
              className="hidden sm:inline-flex text-xs font-medium text-ink hover:text-terracotta px-2 py-1 transition-colors"
            >
              Mở gian hàng
            </Link>

            {/* Login / Auth */}
            <Link
              href="/login"
              className="hidden xl:inline-flex text-xs font-medium text-ink-muted hover:text-ink px-2 py-1 transition-colors"
            >
              Đăng nhập
            </Link>

            {/* Unified Multi-Vendor Cart Pill */}
            <Link
              href="/cart"
              className="tactile-button hover-lift flex items-center gap-2.5 bg-ink hover:bg-ink-secondary text-surface px-4 py-2 rounded-xl shadow-subtle cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-surface" />
                {summary.totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-terracotta text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {summary.totalItems}
                  </span>
                )}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[10px] text-surface/70 font-normal leading-none">
                  Giỏ đa xưởng
                </p>
                <p className="text-xs font-semibold leading-tight text-surface tabular-nums">
                  {summary.grandTotal > 0 ? formatVND(summary.grandTotal) : "0 ₫"}
                </p>
              </div>
            </Link>

            {/* User Profile */}
            <Link
              href="/account/orders"
              title="Tài khoản của tôi"
              className="tactile-button w-9 h-9 rounded-xl hairline-border flex items-center justify-center text-ink-secondary hover:text-ink hover:bg-canvas-warm transition-[background-color,color] duration-200"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive ⌘K Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="bg-surface rounded-2xl hairline-border max-w-xl w-full overflow-hidden shadow-float">
            <div className="p-4 hairline-b flex items-center gap-3">
              <Search className="w-5 h-5 text-ink-muted flex-shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Tìm tác phẩm, biến thể hoặc tên gian hàng (bấm Enter để xem tất cả)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchTerm.trim()) {
                    setSearchModalOpen(false);
                    window.location.href = `/search?q=${encodeURIComponent(searchTerm.trim())}`;
                  }
                }}
                className="flex-1 text-sm focus:outline-none text-ink placeholder:text-ink-faint"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="text-ink-muted hover:text-ink text-xs px-2 py-1 rounded bg-canvas-warm cursor-pointer"
              >
                ESC
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-3 space-y-1">
              <span className="text-[10px] font-medium text-ink-muted uppercase tracking-wider px-3 block pt-1">
                Gợi ý tìm kiếm
              </span>

              {filteredSuggestions.length === 0 ? (
                <p className="text-xs text-ink-muted py-6 text-center">Không tìm thấy kết quả phù hợp</p>
              ) : (
                filteredSuggestions.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setSearchModalOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-canvas-warm transition-[background-color] duration-150 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-surface hairline-border flex items-center justify-center flex-shrink-0 text-ink-secondary">
                        {item.type === "store" ? <Store className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-ink group-hover:text-terracotta transition-colors truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-ink-muted truncate">{item.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-ink-faint group-hover:text-ink transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
                  </Link>
                ))
              )}
            </div>

            <div className="p-3 bg-canvas-warm hairline-t flex items-center justify-between text-[11px] text-ink-muted">
              {searchTerm.trim() ? (
                <Link
                  href={`/search?q=${encodeURIComponent(searchTerm.trim())}`}
                  onClick={() => setSearchModalOpen(false)}
                  className="text-ink font-semibold hover:underline flex items-center gap-1"
                >
                  Xem tất cả kết quả cho &quot;{searchTerm}&quot; <ArrowRight className="w-3 h-3" />
                </Link>
              ) : (
                <span>Bấm <kbd className="bg-surface px-1 py-0.5 rounded hairline-border text-[10px]">ESC</kbd> để đóng</span>
              )}
              <span className="text-ink font-medium">Vendora Search</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
