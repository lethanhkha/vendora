import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, CheckCircle2, Store } from "lucide-react";
import { getPublishedProducts, getCategories } from "@/modules/catalog/product-service";
import { ProductCard } from "@/components/catalog/ProductCard";

export const revalidate = 0; // Dynamic server rendering for live inventory

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const categoriesList = await getCategories();
  const selectedCategory = categoriesList.find((c) => c.slug === params.category);
  const products = await getPublishedProducts(selectedCategory?.id);

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* Hero Section: Editorial Atelier Stage */}
      <section className="relative overflow-hidden rounded-3xl bg-surface-warm hairline-border p-8 sm:p-12 lg:p-16">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface hairline-border text-xs font-medium text-ink-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
              <span>Tuyển chọn xưởng chế tác thủ công Việt Nam</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink leading-[1.12]">
              Tinh hoa chế tác độc bản.{" "}
              <span className="block text-ink-muted font-normal mt-2 text-2xl sm:text-4xl lg:text-5xl">
                Gom chung một giỏ hàng.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed max-w-xl">
              Khám phá các xưởng phím cơ, đồ da mộc thảo mộc và nghệ thuật gốm men hỏa biến trên toàn Việt Nam.
              Tự do mua sắm từ nhiều nghệ nhân khác nhau trong một lần thanh toán, được bảo hộ an tâm qua cơ chế ký quỹ 15 ngày.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#products-feed"
                className="tactile-button hover-lift px-6 py-3.5 rounded-xl bg-ink hover:bg-ink-secondary text-surface text-sm font-medium shadow-subtle flex items-center gap-2 group cursor-pointer"
              >
                <span>Khám phá tác phẩm</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>

              <Link
                href="/vendor/onboarding"
                className="tactile-button px-6 py-3.5 rounded-xl bg-surface hover:bg-canvas-subtle hairline-border text-ink text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Store className="w-4 h-4 text-ink-secondary" />
                <span>Mở gian hàng xưởng</span>
              </Link>
            </div>

            <div className="pt-6 hairline-t flex flex-wrap items-center gap-y-2 gap-x-8 text-xs text-ink-muted">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-ink" /> Ký quỹ bảo hộ 15 ngày
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ink" /> Giao trực tiếp từ xưởng
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ink" /> Đóng gói tách kiện độc lập
              </span>
            </div>
          </div>

          {/* Curated Multi-Vendor Parcel Preview */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="bg-surface rounded-2xl hairline-border p-6 shadow-elevate">
              <div className="flex items-center justify-between pb-3.5 hairline-b mb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-ink-muted font-medium block">
                    Đơn hàng gom đa xưởng
                  </span>
                  <span className="text-sm font-semibold text-ink">Kiện Hàng Hợp Nhất</span>
                </div>
                <span className="text-xs bg-canvas-warm text-ink-secondary px-2.5 py-1 rounded-full font-medium hairline-border">
                  2 Xưởng đồng gửi
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-canvas-warm/70">
                  <div className="w-10 h-10 rounded-lg overflow-hidden relative flex-shrink-0 hairline-border bg-surface">
                    <Image
                      src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=120&q=80"
                      alt="Keyboard"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-ink truncate">Phím Cơ Walnut 75%</p>
                    <p className="text-[11px] text-ink-muted">KeebCraft VN (Hà Nội)</p>
                  </div>
                  <span className="text-xs font-medium text-ink tabular-nums">1.850.000 ₫</span>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-canvas-warm/70">
                  <div className="w-10 h-10 rounded-lg overflow-hidden relative flex-shrink-0 hairline-border bg-surface">
                    <Image
                      src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=120&q=80"
                      alt="Deskpad"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-ink truncate">Deskpad Da Bò Sáp Ý</p>
                    <p className="text-[11px] text-ink-muted">Aura Saigon (TP.HCM)</p>
                  </div>
                  <span className="text-xs font-medium text-ink tabular-nums">450.000 ₫</span>
                </div>
              </div>

              <div className="mt-5 pt-4 hairline-t flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-ink-muted block">Tổng thanh toán (1 lần)</span>
                  <span className="text-base font-bold text-ink tabular-nums">2.300.000 ₫</span>
                </div>
                <Link
                  href="/cart"
                  className="tactile-button px-4 py-2 rounded-xl bg-ink hover:bg-ink-secondary text-surface text-xs font-medium shadow-subtle"
                >
                  Xem giỏ hàng
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Filter */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between pb-3 hairline-b">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
            Danh mục tuyển chọn
          </h2>
          <span className="text-xs text-ink-muted font-medium">
            {products.length} tác phẩm sẵn sàng
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Link
            href="/"
            className={`px-4 py-2 rounded-xl text-xs font-medium tactile-button transition-colors whitespace-nowrap ${
              !params.category
                ? "bg-ink text-surface shadow-subtle"
                : "bg-surface hairline-border text-ink-secondary hover:text-ink hover:border-hairline-hover"
            }`}
          >
            Tất cả tác phẩm
          </Link>

          {categoriesList.map((cat) => (
            <Link
              key={cat.id}
              href={`/?category=${cat.slug}`}
              className={`px-4 py-2 rounded-xl text-xs font-medium tactile-button transition-colors whitespace-nowrap ${
                params.category === cat.slug
                  ? "bg-ink text-surface shadow-subtle"
                  : "bg-surface hairline-border text-ink-secondary hover:text-ink hover:border-hairline-hover"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Multi-Vendor Product Feed */}
      <section id="products-feed" className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
            Tác phẩm mới xuất xưởng
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Mỗi tác phẩm đều ghi rõ xưởng chế tác độc lập và cam kết chất lượng chuẩn mực
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-2xl hairline-border">
            <p className="text-sm text-ink-muted">Chưa có tác phẩm nào trong danh mục này.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Boutiques Directory */}
      <section className="bg-surface rounded-3xl hairline-border p-8 sm:p-12 space-y-8">
        <div className="pb-4 hairline-b">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
            Xưởng chế tác tiêu biểu
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Những nghệ nhân và xưởng gia công uy tín hàng đầu với tỷ lệ hài lòng cao
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/store/keebcraft-vn"
            className="p-5 rounded-2xl bg-canvas-warm/50 hairline-border flex items-center gap-4 hover-lift group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden relative flex-shrink-0 hairline-border bg-surface">
              <Image
                src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=140&q=80"
                alt="KeebCraft"
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-ink group-hover:text-terracotta transition-[color] duration-200 truncate">
                KeebCraft VN
              </h4>
              <p className="text-xs text-ink-muted mt-0.5">Ba Đình, Hà Nội</p>
              <span className="text-[11px] text-ink-secondary font-medium mt-1 inline-block">
                Bàn phím cơ &amp; Phụ kiện
              </span>
            </div>
          </Link>

          <Link
            href="/store/aura-saigon-leather"
            className="p-5 rounded-2xl bg-canvas-warm/50 hairline-border flex items-center gap-4 hover-lift group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden relative flex-shrink-0 hairline-border bg-surface">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=140&q=80"
                alt="Aura Saigon"
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-ink group-hover:text-terracotta transition-[color] duration-200 truncate">
                Aura Saigon Leather
              </h4>
              <p className="text-xs text-ink-muted mt-0.5">Quận 1, TP.HCM</p>
              <span className="text-[11px] text-ink-secondary font-medium mt-1 inline-block">
                Da bò mộc thủ công
              </span>
            </div>
          </Link>

          <Link
            href="/store/battrang-atelier"
            className="p-5 rounded-2xl bg-canvas-warm/50 hairline-border flex items-center gap-4 hover-lift group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden relative flex-shrink-0 hairline-border bg-surface">
              <Image
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=140&q=80"
                alt="Bát Tràng"
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-ink group-hover:text-terracotta transition-[color] duration-200 truncate">
                Gốm Bát Tràng Atelier
              </h4>
              <p className="text-xs text-ink-muted mt-0.5">Gia Lâm, Hà Nội</p>
              <span className="text-[11px] text-ink-secondary font-medium mt-1 inline-block">
                Men hỏa biến độc bản
              </span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
