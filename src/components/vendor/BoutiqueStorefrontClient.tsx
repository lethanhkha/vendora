"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Store,
  MapPin,
  Star,
  Clock,
  ShieldCheck,
  Heart,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  PackageCheck,
  Award
} from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

type VendorData = {
  id: string;
  shopName: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  badge: string;
  location: string;
  rating: string;
  status: string;
};

type ProductItem = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  categoryName: string;
  price: string;
  primarySkuId: string | null;
  availableStock: number;
  skus: Array<{
    id: string;
    skuCode: string;
    price: string;
    attributes: any;
    availableStock: number | null;
  }>;
};

export function BoutiqueStorefrontClient({
  vendor,
  products,
}: {
  vendor: VendorData;
  products: ProductItem[];
}) {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<"ALL" | "NEW" | "REVIEWS" | "ABOUT">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(1420);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "maker", text: `Xin chào! Chào mừng bạn đến với xưởng của ${vendor.shopName}. Mình có thể hỗ trợ tư vấn chế tác gì cho bạn?`, time: "10:30" }
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const formatVND = (amount: number | string) => {
    return new Intl.NumberFormat("vi-VN").format(Number(amount)) + " ₫";
  };

  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowersCount((prev) => prev - 1);
    } else {
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
      showToast(`Đã theo dõi gian hàng ${vendor.shopName}!`);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newHistory = [
      ...chatHistory,
      { sender: "buyer", text: chatMessage, time: "Vừa xong" }
    ];
    setChatHistory(newHistory);
    setChatMessage("");

    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "maker",
          text: `Cảm ơn bạn đã nhắn tin! Nghệ nhân xưởng ${vendor.shopName} sẽ phản hồi bạn trong ít phút.`,
          time: "Vừa xong"
        }
      ]);
    }, 1000);
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesQuery = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStock = !inStockOnly || p.availableStock > 0;
    return matchesQuery && matchesStock;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-dark text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-primary transition">Trang Chủ</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span>Gian Hàng Nghệ Nhân</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-dark font-bold">{vendor.shopName}</span>
      </nav>

      {/* Maker Workshop Header & Studio Showcase */}
      <div className="relative rounded-3xl overflow-hidden card-border bg-white shadow-soft">
        {/* Cover Photo */}
        <div className="relative h-56 sm:h-72 w-full bg-slate-900 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1600&q=80"
            alt={`${vendor.shopName} Workshop Banner`}
            fill
            className="object-cover opacity-60 hover:scale-105 transition-transform duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent" />

          {/* Badge top right */}
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-dark/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-xs text-white">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-semibold text-[11px]">Top Boutique 2025</span>
          </div>
        </div>

        {/* Profile Card Body */}
        <div className="p-6 sm:p-8 -mt-16 sm:-mt-20 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Atelier Avatar */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-1.5 card-border shadow-xl flex-shrink-0">
              <div className="w-full h-full rounded-xl overflow-hidden relative bg-slate-100">
                <Image
                  src={vendor.logoUrl || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80"}
                  alt={vendor.shopName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            {/* Shop Details */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white sm:text-dark">
                  {vendor.shopName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-vendor-seal text-xs font-bold border border-purple-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {vendor.badge}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ACTIVE
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 sm:text-slate-600 max-w-xl leading-relaxed">
                {vendor.description || "Xưởng chế tác thủ công độc lập chất lượng cao được bảo chứng bởi Vendora."}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-400 sm:text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {vendor.location}
                </span>
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {vendor.rating} ★ (128 đánh giá)
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <Clock className="w-3.5 h-3.5" /> Phản hồi 98% (&lt;15 phút)
                </span>
                <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                  <PackageCheck className="w-3.5 h-3.5" /> Xuất xưởng trong 24h
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleFollowToggle}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                isFollowing
                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300"
                  : "bg-primary text-white hover:bg-primary-hover shadow-glow"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFollowing ? "fill-rose-500 text-rose-500" : ""}`} />
              <span>{isFollowing ? "Đang Theo Dõi" : `Theo Dõi Shop (${followersCount.toLocaleString()})`}</span>
            </button>

            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 shadow-sm transition flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-primary" />
              <span>Nhắn Tin Maker</span>
            </button>
          </div>
        </div>

        {/* In-Store Tab Navigation Bar */}
        <div className="px-6 sm:px-8 border-t border-slate-100 flex items-center justify-between overflow-x-auto bg-slate-50/50">
          <div className="flex items-center gap-8 text-xs font-bold">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`py-4 border-b-2 transition flex items-center gap-1.5 ${
                activeTab === "ALL"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-dark"
              }`}
            >
              <span>Tất Cả Sản Phẩm</span>
              <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("NEW")}
              className={`py-4 border-b-2 transition flex items-center gap-1.5 ${
                activeTab === "NEW"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-dark"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Hàng Mới Về</span>
            </button>

            <button
              onClick={() => setActiveTab("REVIEWS")}
              className={`py-4 border-b-2 transition flex items-center gap-1.5 ${
                activeTab === "REVIEWS"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-dark"
              }`}
            >
              <span>Đánh Giá Khách Hàng (128)</span>
            </button>

            <button
              onClick={() => setActiveTab("ABOUT")}
              className={`py-4 border-b-2 transition flex items-center gap-1.5 ${
                activeTab === "ABOUT"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-dark"
              }`}
            >
              <span>Về Xưởng Chế Tác</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content by Tab */}
      {activeTab === "ALL" && (
        <div className="space-y-6">
          {/* In-Store Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white card-border">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder={`Tìm kiếm trong ${vendor.shopName}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-semibold select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
                />
                <span>Chỉ hiển thị còn hàng</span>
              </label>

              <span className="text-slate-300">|</span>

              <span className="text-slate-500 text-xs">
                Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
              </span>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white card-border rounded-3xl p-8 space-y-3">
              <Store className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-dark">Không tìm thấy sản phẩm phù hợp</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Hãy thử từ khóa khác hoặc bỏ chọn bộ lọc chỉ còn hàng để xem toàn bộ danh mục của xưởng.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((p) => {
                const primarySku = p.skus[0];
                return (
                  <div
                    key={p.id}
                    className="group bg-white rounded-2xl card-border overflow-hidden hover:shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Product Image */}
                      <Link href={`/products/${p.slug}`} className="block relative aspect-square bg-slate-100 overflow-hidden">
                        <Image
                          src={p.imageUrl || "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"}
                          alt={p.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {p.availableStock <= 5 && p.availableStock > 0 && (
                          <span className="absolute top-2.5 left-2.5 bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
                            Chỉ còn {p.availableStock}
                          </span>
                        )}
                        {p.availableStock === 0 && (
                          <span className="absolute top-2.5 left-2.5 bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
                            Tạm hết hàng
                          </span>
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="p-4 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {p.categoryName}
                        </span>

                        <Link href={`/products/${p.slug}`}>
                          <h4 className="text-xs font-bold text-dark group-hover:text-primary transition line-clamp-2 leading-snug">
                            {p.title}
                          </h4>
                        </Link>

                        <div className="flex items-center justify-between pt-1">
                          <p className="text-sm font-extrabold text-primary">
                            {formatVND(p.price)}
                          </p>
                          <span className="text-[10px] text-slate-400 font-medium">
                            Kho: {p.availableStock}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Add Button */}
                    <div className="p-4 pt-0">
                      <button
                        onClick={() => {
                          if (primarySku) {
                            addToCart({
                              skuId: primarySku.id,
                              productId: p.id,
                              productTitle: p.title,
                              productSlug: p.slug,
                              imageUrl: p.imageUrl || undefined,
                              price: primarySku.price,
                              quantity: 1,
                              attributes: primarySku.attributes,
                              vendorId: vendor.id,
                              vendorName: vendor.shopName,
                              vendorSlug: vendor.slug,
                              vendorLocation: vendor.location,
                            });
                            showToast(`Đã thêm "${p.title}" vào giỏ hàng!`);
                          }
                        }}
                        disabled={p.availableStock === 0}
                        className="w-full py-2 rounded-xl bg-slate-50 hover:bg-primary text-slate-700 hover:text-white text-xs font-bold border border-slate-200 hover:border-transparent transition flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{p.availableStock > 0 ? "Thêm Vào Giỏ" : "Hết Hàng"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* New Arrivals Tab */}
      {activeTab === "NEW" && (
        <div className="bg-white card-border rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-dark">Bộ Sưu Tập Mới Ra Mắt</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
            Các sản phẩm độc bản được hoàn thiện trong tuần này từ xưởng chế tác {vendor.shopName}, số lượng giới hạn theo từng mẻ hoàn thiện.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {products.slice(0, 3).map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group p-4 rounded-2xl border border-slate-100 hover:border-primary/20 bg-slate-50/50 hover:bg-white transition flex gap-4"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                  <Image src={p.imageUrl || ""} alt={p.title} fill className="object-cover" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-amber-600">Mới Nhất</p>
                  <h4 className="text-xs font-bold text-dark group-hover:text-primary transition line-clamp-2">
                    {p.title}
                  </h4>
                  <p className="text-xs font-extrabold text-primary">{formatVND(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === "REVIEWS" && (
        <div className="bg-white card-border rounded-3xl p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <h3 className="text-lg font-bold text-dark">Đánh Giá Từ Khách Hàng Xác Thực</h3>
              <p className="text-xs text-slate-500 mt-1">100% đánh giá từ người mua đã nhận hàng qua hệ thống Escrow.</p>
            </div>
            <div className="flex items-center gap-2 text-2xl font-extrabold text-dark">
              <span>{vendor.rating}</span>
              <div className="flex text-amber-400 text-sm">★★★★★</div>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                name: "Nguyễn Hải Đăng",
                role: "Khách mua phím Walnut 75%",
                rating: 5,
                comment: "Gỗ óc chó tiện CNC rất mịn và đầm tay, switch bôi trơn Krytox âm nghe thocky rất trầm. Shop đóng gói cực kỳ cẩn thận với 2 lớp hộp và xốp hơi.",
                date: "3 ngày trước"
              },
              {
                name: "Trần Mai Anh",
                role: "Khách mua Deskpad Da Bò",
                rating: 5,
                comment: "Da bò mùi thơm tự nhiên rất dễ chịu, đường may tay thủ công đều tăm tắp. Đã mua thêm 1 chiếc tặng bạn.",
                date: "1 tuần trước"
              },
              {
                name: "Vũ Quang Huy",
                role: "Khách mua Bình Gốm Bát Tràng",
                rating: 5,
                comment: "Men hỏa biến màu sắc biến đổi rất ảo diệu dưới ánh đèn vàng. Chủ shop hỗ trợ nhiệt tình, tư vấn chọn dáng bình vừa vặn với kệ sách.",
                date: "2 tuần trước"
              }
            ].map((rev, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-dark">{rev.name}</span>
                    <span className="text-[10px] text-slate-400 ml-2">({rev.role})</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>
                <div className="flex text-amber-400 text-xs">★★★★★</div>
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* About Tab */}
      {activeTab === "ABOUT" && (
        <div className="bg-white card-border rounded-3xl p-8 space-y-6">
          <h3 className="text-lg font-bold text-dark">Giới Thiệu Xưởng Chế Tác</h3>
          <div className="prose prose-sm text-slate-600 text-xs leading-relaxed space-y-3">
            <p>
              {vendor.description || `${vendor.shopName} là xưởng chế tác thủ công chuyên nghiệp hoạt động tại ${vendor.location}.`}
            </p>
            <p>
              Chúng tôi cam kết sử dụng 100% nguyên liệu tự nhiên cao cấp, trải qua các khâu xử lý thủ công tỉ mỉ với độ chính xác ±0.05mm. Mỗi sản phẩm xuất xưởng đều được kiểm định riêng biệt bởi nghệ nhân chính.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
                <p className="text-lg font-extrabold text-primary">100%</p>
                <p className="text-[11px] text-slate-500 font-medium">Gỗ & Da Tự Nhiên Nhập Khẩu</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
                <p className="text-lg font-extrabold text-primary">24 Giờ</p>
                <p className="text-[11px] text-slate-500 font-medium">Xuất Xưởng & Giao Bưu Cục</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
                <p className="text-lg font-extrabold text-primary">24 Tháng</p>
                <p className="text-[11px] text-slate-500 font-medium">Bảo Hành Chính Hãng 1 Đổi 1</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Chat Drawer */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 rounded-3xl bg-white card-border shadow-2xl overflow-hidden flex flex-col h-[460px] animate-in fade-in slide-in-from-bottom-5">
          {/* Chat Header */}
          <div className="p-4 bg-dark text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden relative bg-slate-700">
                <Image src={vendor.logoUrl || ""} alt={vendor.shopName} fill className="object-cover" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">{vendor.shopName}</p>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Trực tuyến
                </span>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === "buyer" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    msg.sender === "buyer"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-white card-border text-dark rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              placeholder="Nhập tin nhắn gửi xưởng..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-hover transition"
            >
              Gửi
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
