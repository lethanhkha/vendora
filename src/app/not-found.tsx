import React from "react";
import Link from "next/link";
import { Compass, Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-8 bg-surface p-8 sm:p-10 rounded-3xl hairline-border shadow-subtle">
        {/* Visual Badge Icon */}
        <div className="w-16 h-16 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center mx-auto shadow-inner">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        {/* 404 Typography */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta">
            404 • Không Tìm Thấy Trang
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Lạc Lối Giữa Các Xưởng Chế Tác
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            Tác phẩm hoặc trang bạn đang tìm kiếm có thể đã được chuyển đổi, hết hạn lưu trữ hoặc chưa từng tồn tại trên Vendora.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-surface text-sm font-semibold tactile-button hover-lift shadow-subtle transition"
          >
            <Home className="w-4 h-4" />
            <span>Về Trang Chủ</span>
          </Link>
          <Link
            href="/search"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl hairline-border bg-surface text-ink text-sm font-semibold hover:border-hairline-hover hover:bg-canvas-warm transition"
          >
            <Search className="w-4 h-4 text-ink-secondary" />
            <span>Tìm Tác Phẩm</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
