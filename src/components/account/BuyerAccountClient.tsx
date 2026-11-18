"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Package,
  MapPin,
  Heart,
  CreditCard,
  Bell,
  Search,
  ChevronRight,
  Truck,
  ExternalLink,
  RotateCcw,
  Star,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Store,
  ArrowRight
} from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

type OrderItem = {
  id: string;
  productTitle: string | null;
  quantity: number;
  unitPrice: string;
};

type SubOrder = {
  id: string;
  subOrderNumber: string | null;
  vendorId: string;
  subtotalAmount: string;
  shippingFee: string;
  status: string;
  vendor?: {
    shopName: string;
    slug: string;
    logoUrl: string | null;
    badge: string;
    location: string;
  } | null;
  items: OrderItem[];
};

type MasterOrder = {
  id: string;
  orderNumber: string | null;
  recipientName: string | null;
  recipientPhone: string | null;
  shippingAddress: string;
  totalAmount: string;
  paymentMethod: string;
  paymentStatus: string;
  overallStatus: string;
  createdAt: Date;
  vendorOrders: SubOrder[];
};

export function BuyerAccountClient({
  orders,
}: {
  orders: MasterOrder[];
}) {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<"ALL" | "IN_TRANSIT" | "COMPLETED" | "PROCESSING">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const formatVND = (amount: number | string) => {
    return new Intl.NumberFormat("vi-VN").format(Number(amount)) + " ₫";
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReorder = (order: MasterOrder) => {
    let count = 0;
    order.vendorOrders.forEach((vo) => {
      vo.items.forEach((item) => {
        addToCart({
          skuId: item.id,
          productId: item.id,
          productTitle: item.productTitle || "Sản phẩm",
          productSlug: "ban-phim-co-go-oc-cho-fas-75",
          price: item.unitPrice,
          quantity: item.quantity,
          vendorId: vo.vendorId,
          vendorName: vo.vendor?.shopName || "Gian Hàng Đối Tác",
          vendorSlug: vo.vendor?.slug || "keebcraft-vn",
          vendorLocation: vo.vendor?.location || "Hà Nội",
        });
        count++;
      });
    });
    showToast(`Đã thêm ${count} sản phẩm từ đơn #${order.orderNumber} vào giỏ hàng!`);
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.orderNumber && order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.vendorOrders.some((vo) =>
        vo.items.some((item) => item.productTitle?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        vo.vendor?.shopName.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (!matchesSearch) return false;

    if (activeTab === "IN_TRANSIT") return order.overallStatus === "PROCESSING" || order.overallStatus === "SHIPPED";
    if (activeTab === "COMPLETED") return order.overallStatus === "DELIVERED";
    if (activeTab === "PROCESSING") return order.overallStatus === "PENDING";
    return true;
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
        <span>Tài Khoản Khách Hàng</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-dark font-bold">Lịch Sử Mua Hàng</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Profile Summary Card */}
          <div className="p-6 rounded-3xl bg-white card-border shadow-soft space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-extrabold text-base flex-shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-sm text-dark truncate">Minh Anh</p>
                <p className="text-[11px] text-slate-400 truncate">buyer@vendora.vn</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                  Thành Viên Vàng
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <p className="flex items-center justify-between">
                <span>Tham gia:</span>
                <strong className="text-dark">Tháng 11, 2025</strong>
              </p>
              <p className="flex items-center justify-between">
                <span>Tổng đơn mua:</span>
                <strong className="text-primary">{orders.length} đơn</strong>
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="p-3 rounded-3xl bg-white card-border shadow-soft space-y-1 text-xs font-semibold">
            <Link
              href="/account/orders"
              className="flex items-center justify-between p-3 rounded-2xl bg-primary text-white font-bold transition shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>Đơn Mua Của Tôi</span>
              </div>
              <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {orders.length}
              </span>
            </Link>

            <button
              onClick={() => showToast("Chức năng sổ địa chỉ đã được kích hoạt!")}
              className="w-full flex items-center gap-2.5 p-3 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-dark transition text-left"
            >
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Sổ Địa Chỉ Giao Hàng</span>
            </button>

            <button
              onClick={() => showToast("Bạn đang có 4 sản phẩm trong danh sách yêu thích.")}
              className="w-full flex items-center justify-between p-3 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-dark transition text-left"
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Sản Phẩm Yêu Thích</span>
              </div>
              <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">
                4
              </span>
            </button>

            <button
              onClick={() => showToast("Tài khoản đã liên kết thanh toán VietQR Instant.")}
              className="w-full flex items-center gap-2.5 p-3 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-dark transition text-left"
            >
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span>Phương Thức Thanh Toán</span>
            </button>

            <button
              onClick={() => showToast("Không có thông báo mới.")}
              className="w-full flex items-center gap-2.5 p-3 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-dark transition text-left"
            >
              <Bell className="w-4 h-4 text-slate-400" />
              <span>Thông Báo Đơn Hàng</span>
            </button>
          </div>

          {/* Escrow Guarantee Callout */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 card-border text-xs text-indigo-950 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-primary">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cơ Chế Ký Quỹ Vendora</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Mọi khoản tiền bạn thanh toán đều được lưu giữ tại ví ký quỹ trung gian trong 15 ngày và chỉ chuyển giao cho từng nhà bán khi bạn đã nhận hàng nguyên vẹn.
            </p>
          </div>
        </div>

        {/* Right Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Main Title & Search */}
          <div className="p-6 rounded-3xl bg-white card-border shadow-soft space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-extrabold text-dark">
                  Đơn Mua & Biên Nhận Đa Shop (My Purchases)
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Theo dõi từng kiện hàng phân tách độc lập từ các xưởng chế tác thủ công.
                </p>
              </div>

              {/* Search Orders */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Tìm mã đơn, tên sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 text-xs font-bold">
              {[
                { id: "ALL", label: "Tất Cả Đơn" },
                { id: "PROCESSING", label: "Chờ Tiếp Nhận" },
                { id: "IN_TRANSIT", label: "Đang Vận Chuyển" },
                { id: "COMPLETED", label: "Đã Hoàn Thành" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl transition ${
                    activeTab === tab.id
                      ? "bg-dark text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white card-border rounded-3xl p-8 space-y-4">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-dark">Chưa có đơn hàng nào trong mục này</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Bạn chưa có đơn hàng nào khớp với điều kiện lọc hiện tại. Khám phá các gian hàng boutique ngay!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition"
              >
                <span>Duyệt Sản Phẩm Ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-3xl bg-white card-border shadow-soft overflow-hidden p-6 sm:p-7 space-y-5"
                >
                  {/* Master Order Top Info Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-primary flex items-center justify-center font-extrabold text-sm border border-indigo-100">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-dark">
                            Đơn #{order.orderNumber || order.id.slice(0, 8)}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-primary">
                            {order.vendorOrders.length} Kiện Tách Lập
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN", { hour: "2-digit", minute: "2-digit" })} • Thanh toán: {order.paymentMethod}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right sm:block">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">Tổng Tiền Đơn</p>
                        <p className="text-base font-extrabold text-primary leading-tight">
                          {formatVND(order.totalAmount)}
                        </p>
                      </div>

                      <Link
                        href={`/orders/${order.id}`}
                        className="px-3.5 py-2 rounded-xl bg-primary-light text-primary hover:bg-indigo-100 text-xs font-bold transition flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Theo Dõi Kiện</span>
                      </Link>
                    </div>
                  </div>

                  {/* Nested Sub-Orders from Vendors */}
                  <div className="space-y-4">
                    {order.vendorOrders.map((vo, i) => (
                      <div
                        key={vo.id}
                        className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Store className="w-3.5 h-3.5 text-vendor-seal" />
                            <Link
                              href={`/store/${vo.vendor?.slug || ""}`}
                              className="text-xs font-bold text-dark hover:text-primary transition"
                            >
                              Xưởng: {vo.vendor?.shopName || "Gian Hàng Đối Tác"}
                            </Link>
                            <span className="text-[9px] text-slate-400">({vo.vendor?.location})</span>
                          </div>

                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            Đang Xử Lý Gói Hàng
                          </span>
                        </div>

                        {/* Items in Sub-order */}
                        <div className="space-y-2">
                          {vo.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-xs">
                              <span className="text-slate-700 font-medium">
                                • {item.productTitle} <span className="text-slate-400">(x{item.quantity})</span>
                              </span>
                              <span className="font-bold text-dark">
                                {formatVND(Number(item.unitPrice) * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                          <span>Phí vận chuyển kiện xưởng: <strong>{formatVND(vo.shippingFee)}</strong></span>
                          <span>Mã bưu gửi: <code className="font-semibold text-slate-700">{vo.subOrderNumber || vo.id.slice(0, 6)}</code></span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Bảo vệ bởi Quỹ Ký Quỹ Escrow 15 ngày
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/orders/${order.id}/dispute`}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-amber-400 text-slate-600 hover:text-amber-700 font-semibold transition"
                      >
                        Khiếu Nại
                      </Link>

                      <Link
                        href={`/orders/${order.id}/review`}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-primary font-bold border border-indigo-100 transition"
                      >
                        Đánh Giá
                      </Link>

                      <button
                        onClick={() => handleReorder(order)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Mua Lại</span>
                      </button>

                      <Link
                        href={`/orders/${order.id}`}
                        className="px-3.5 py-1.5 rounded-xl bg-dark text-white hover:bg-slate-800 font-bold transition flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Xem Chi Tiết & Hóa Đơn</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
