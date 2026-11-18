import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, BadgeCheck, CreditCard } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-surface hairline-t mt-24">
      {/* 4 Trust Pillars */}
      <div className="hairline-b py-10 bg-canvas-warm/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-surface hairline-border text-ink flex-shrink-0 shadow-subtle">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ink">Ký quỹ Escrow 15 ngày</h4>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                Khoản thanh toán được phong tỏa an toàn đến khi bạn kiểm tra và hài lòng.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-surface hairline-border text-ink flex-shrink-0 shadow-subtle">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ink">Giao từ xưởng chế tác</h4>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                Tác phẩm xuất xưởng trực tiếp từ nghệ nhân, nguyên bản không qua trung gian.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-surface hairline-border text-ink flex-shrink-0 shadow-subtle">
              <BadgeCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ink">Kiểm định độc lập</h4>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                Mỗi gian hàng đều được định danh pháp lý và cam kết chất lượng vật liệu.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-surface hairline-border text-ink flex-shrink-0 shadow-subtle">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ink">Thanh toán đa kênh tức thì</h4>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                Hỗ trợ VietQR, MoMo, thẻ quốc tế và COD với biên lai tự động cho từng shop.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-ink flex items-center justify-center text-surface shadow-subtle">
                <span className="font-bold text-xs">V</span>
              </div>
              <span className="text-base font-bold text-ink">Vendora</span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed mb-4">
              Sàn thương mại điện tử tuyển chọn các xưởng chế tác thủ công độc lập hàng đầu Việt Nam. Gom chung giỏ hàng, thanh toán một lần.
            </p>
            <p className="text-[11px] text-ink-faint">
              &copy; 2026 Vendora Inc. All rights reserved.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-ink mb-3.5">Khám phá</h5>
            <ul className="space-y-2.5 text-xs text-ink-secondary">
              <li><Link href="/" className="hover:text-ink transition-colors">Trang chủ Marketplace</Link></li>
              <li><Link href="/search" className="hover:text-ink transition-colors font-medium">Tìm kiếm &amp; Bộ lọc</Link></li>
              <li><Link href="/account/orders" className="hover:text-ink transition-colors">Đơn mua &amp; Bưu kiện</Link></li>
              <li><Link href="/login" className="hover:text-ink transition-colors">Đăng nhập / Đăng ký</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-ink mb-3.5">Kênh xưởng &amp; Quản trị</h5>
            <ul className="space-y-2.5 text-xs text-ink-secondary">
              <li><Link href="/vendor/onboarding" className="hover:text-ink transition-colors">Mở gian hàng xưởng</Link></li>
              <li><Link href="/vendor/dashboard" className="hover:text-ink transition-colors">Bảng điều khiển Maker Studio</Link></li>
              <li><Link href="/vendor/products/new" className="hover:text-ink transition-colors">Thêm sản phẩm mới</Link></li>
              <li><Link href="/vendor/payouts" className="hover:text-ink transition-colors">Sổ cái doanh thu &amp; Rút tiền</Link></li>
              <li><Link href="/admin" className="hover:text-ink transition-colors text-ink-muted">Trọng tài Escrow (Admin)</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-ink mb-3.5">Phương thức thanh toán</h5>
            <div className="flex flex-wrap gap-2 text-xs text-ink-secondary font-medium">
              <span className="px-2.5 py-1 rounded bg-canvas-warm hairline-border">VietQR</span>
              <span className="px-2.5 py-1 rounded bg-canvas-warm hairline-border">MoMo</span>
              <span className="px-2.5 py-1 rounded bg-canvas-warm hairline-border">ZaloPay</span>
              <span className="px-2.5 py-1 rounded bg-canvas-warm hairline-border">Thẻ ATM / Visa</span>
            </div>
            <p className="text-[11px] text-ink-faint mt-4 leading-relaxed">
              Kiến trúc Modular Monolith tối ưu tốc độ và an toàn giao dịch.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
