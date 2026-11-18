"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Package,
  Truck,
  ShieldCheck,
  Printer,
  Share2,
  Headphones,
  ArrowRight,
  ExternalLink,
  MapPin,
  Clock,
  FileText,
  Sparkles,
  Store,
  ChevronRight,
  Copy,
  Check,
  AlertTriangle,
  Star,
  QrCode,
  RefreshCw
} from "lucide-react";

type OrderItemData = {
  id: string;
  productTitle: string | null;
  quantity: number;
  unitPrice: string;
  sku?: {
    skuCode: string;
    attributes: any;
  } | null;
};

type VendorOrderData = {
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
  items: OrderItemData[];
};

type MasterOrderData = {
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
  vendorOrders: VendorOrderData[];
};

export function OrderSuccessTrackingClient({
  order,
}: {
  order: MasterOrderData;
}) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [currentPaymentStatus, setCurrentPaymentStatus] = useState(order.paymentStatus);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);

  // Poll payment status if still PENDING
  useEffect(() => {
    if (currentPaymentStatus === "PAID") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/webhooks/payment?orderId=${order.id}`);
        const data = await res.json();
        if (data.isPaid) {
          setCurrentPaymentStatus("PAID");
        }
      } catch (err) {
        // Silent poll error
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentPaymentStatus, order.id]);

  const handleSimulatePayment = async () => {
    setIsSimulatingPayment(true);
    try {
      const res = await fetch("/api/webhooks/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber: order.orderNumber,
          amount: order.totalAmount,
          transactionId: "TX-" + Date.now(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentPaymentStatus("PAID");
      }
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setIsSimulatingPayment(false);
    }
  };

  const formatVND = (amount: number | string) => {
    return new Intl.NumberFormat("vi-VN").format(Number(amount)) + " ₫";
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Derived courier for simulation
  const getCourierForVendor = (index: number) => {
    if (index === 0) {
      return {
        name: "Giao Hàng Tiết Kiệm (GHTK Express)",
        code: `GHTK-${order.orderNumber?.replace(/[^0-9]/g, "") || "9921"}-A`,
        sla: "Giao dự kiến: 24 - 48 giờ",
        status: "Đang Chuẩn Bị Hàng",
      };
    }
    return {
      name: "Viettel Post (Hỏa Tốc Liên Tỉnh)",
      code: `VTP-${order.orderNumber?.replace(/[^0-9]/g, "") || "4412"}-B`,
      sla: "Giao dự kiến: 2 - 3 ngày",
      status: "Đã Tiếp Nhận Đơn",
    };
  };

  return (
    <div className="space-y-8 pb-16 print:py-0">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-indigo-900 via-dark to-purple-950 text-white p-3 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-semibold print:hidden shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>⚡ Escrow Node Synchronized: TXID 0x94F2...88A0</span>
        </div>
        <span className="text-slate-300">
          Miễn phí vận chuyển toàn quốc cho đơn gom từ 800.000 ₫ • Code: VENDORA2025
        </span>
      </div>

      {/* Main Success Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white card-border shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  ORDER PLACED
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-vendor-seal">
                  Split Routing Active
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-dark mt-1">
                Đặt Hàng Thành Công • Đơn #{order.orderNumber || order.id.slice(0, 8)}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Cảm ơn <strong>{order.recipientName || "bạn"}</strong>! Khoản thanh toán đang được bảo chứng qua <strong>Vendora Escrow Vault</strong>.
                Đơn hàng đã được tự động tách thành <strong>{order.vendorOrders.length} kiện hàng độc lập</strong> trực tiếp từ các xưởng.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden flex-shrink-0">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Biên Nhận</span>
            </button>
            <button
              onClick={() => handleCopy(window.location.href)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedCode ? "Đã Sao Chép!" : "Chia Sẻ"}</span>
            </button>
          </div>
        </div>

        {/* 4 Pillars Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 card-border space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Tổng Thanh Toán
            </span>
            <p className="text-base font-extrabold text-primary">
              {formatVND(order.totalAmount)}
            </p>
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${currentPaymentStatus === "PAID" ? "text-emerald-600" : "text-amber-600"}`}>
              <CheckCircle2 className="w-3 h-3" />
              {currentPaymentStatus === "PAID"
                ? "Đã Thanh Toán (PAID)"
                : order.paymentMethod === "COD"
                ? "Thanh Toán Khi Nhận (COD)"
                : "Chờ Chuyển Khoản (PENDING)"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 card-border space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Địa Chỉ Giao Hàng
            </span>
            <p className="text-xs font-bold text-dark truncate">
              {order.recipientName} • {order.recipientPhone}
            </p>
            <p className="text-[11px] text-slate-500 line-clamp-1">
              {order.shippingAddress}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 card-border space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Định Tuyến Bưu Kiện
            </span>
            <p className="text-xs font-bold text-dark">
              {order.vendorOrders.length} Kiện Hàng Độc Lập
            </p>
            <p className="text-[11px] text-indigo-600 font-semibold">
              Giao từ các xưởng chế tác gốc
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 card-border space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Bảo Hiểm Ký Quỹ
            </span>
            <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 15-Day Escrow Bond
            </p>
            <p className="text-[11px] text-slate-500">
              Tiền chỉ giải ngân sau khi nhận đủ
            </p>
          </div>
        </div>

        {/* VietQR Live Payment Card */}
        {currentPaymentStatus === "PENDING" && (
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-purple-50/30 to-slate-50 border border-primary/20 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-indigo-100 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-dark flex items-center gap-2">
                    <span>Thanh Toán Chuyển Khoản Qua VietQR 24/7</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Chờ thanh toán
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mở ứng dụng ngân hàng bất kỳ để quét mã QR và xác thực đơn hàng tự động
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1.5 text-indigo-600 font-medium text-[11px]">
                  <RefreshCw className="w-3 h-3 animate-spin text-primary" />
                  Đang lắng nghe Webhook...
                </span>
                <button
                  type="button"
                  disabled={isSimulatingPayment}
                  onClick={handleSimulatePayment}
                  className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-sm transition disabled:opacity-50"
                >
                  {isSimulatingPayment ? "Đang xử lý..." : "Mô Phỏng Đã Chuyển Khoản"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* QR Image */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-white rounded-2xl card-border shadow-sm">
                <div className="w-56 h-56 relative bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={`https://img.vietqr.io/image/MB-0987654321-compact2.png?amount=${Math.round(
                      Number(order.totalAmount)
                    )}&addInfo=${encodeURIComponent(
                      order.orderNumber || order.id.slice(0, 8)
                    )}&accountName=VENDORA%20PLATFORM%20ESCROW`}
                    alt="VietQR Payment Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">
                  Chuẩn VietQR • Napas247 • Mọi Ngân Hàng & Ví Điện Tử
                </p>
              </div>

              {/* Transfer Details */}
              <div className="md:col-span-7 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl card-border">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Ngân hàng</span>
                    <span className="font-extrabold text-dark text-xs">MB Bank (Quân Đội)</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl card-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Số tài khoản</span>
                      <span className="font-mono font-extrabold text-primary text-sm">0987654321</span>
                    </div>
                    <button
                      onClick={() => handleCopy("0987654321")}
                      className="p-1.5 text-slate-400 hover:text-primary rounded-lg hover:bg-slate-50"
                      title="Sao chép số tài khoản"
                    >
                      {copiedCode === "0987654321" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="p-3 bg-white rounded-xl card-border">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Chủ tài khoản</span>
                    <span className="font-extrabold text-dark text-xs">VENDORA PLATFORM ESCROW</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl card-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Số tiền cần chuyển</span>
                      <span className="font-extrabold text-emerald-600 text-sm">
                        {formatVND(order.totalAmount)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(order.totalAmount.toString())}
                      className="p-1.5 text-slate-400 hover:text-primary rounded-lg hover:bg-slate-50"
                      title="Sao chép số tiền"
                    >
                      {copiedCode === order.totalAmount.toString() ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50/80 border border-indigo-200/60 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-indigo-700 uppercase font-bold block">
                      Nội dung chuyển khoản (Bắt buộc giữ nguyên)
                    </span>
                    <span className="font-mono font-extrabold text-primary text-sm">
                      {order.orderNumber || order.id.slice(0, 8)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(order.orderNumber || order.id.slice(0, 8))}
                    className="p-1.5 text-primary hover:bg-white/80 rounded-lg"
                    title="Sao chép nội dung chuyển khoản"
                  >
                    {copiedCode === (order.orderNumber || order.id.slice(0, 8)) ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  💡 Sau khi chuyển khoản thành công, ngân hàng sẽ phát tín hiệu Webhook và trang này sẽ tự động chuyển sang trạng thái đã thanh toán.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Paid Confirmation Seal */}
        {currentPaymentStatus === "PAID" && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 font-bold">
                ✓
              </div>
              <div>
                <span className="font-extrabold block text-sm">Thanh Toán Đã Được Xác Nhận & Ký Quỹ An Toàn</span>
                <span className="text-[11px] text-emerald-700">
                  Khoản tiền đang được giữ tại Vendora Escrow Vault và chỉ được kết chuyển cho các xưởng sau 15 ngày kể từ khi bạn nhận đủ hàng.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Split Delivery Telemetry - Individual Vendor Shipment Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-dark flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              <span>Theo Dõi Tiến Trình Kiện Hàng Tách Lập (Artisan Split Telemetry)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Mỗi xưởng trực tiếp đóng gói và bàn giao cho đơn vị vận chuyển riêng để đảm bảo thời gian nhanh nhất.
            </p>
          </div>

          <button
            onClick={() => setShowMapModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-light text-primary hover:bg-indigo-100 text-xs font-bold transition"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Xem Bản Đồ Lộ Trình</span>
          </button>
        </div>

        <div className="space-y-6">
          {order.vendorOrders.map((vo, idx) => {
            const courier = getCourierForVendor(idx);
            const vendorName = vo.vendor?.shopName || "Gian Hàng Đối Tác";
            const vendorLocation = vo.vendor?.location || "Việt Nam";

            return (
              <div
                key={vo.id}
                className="rounded-3xl bg-white card-border shadow-soft overflow-hidden p-6 sm:p-8 space-y-6"
              >
                {/* Vendor Sub-Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-vendor-seal flex items-center justify-center font-extrabold text-sm border border-purple-100">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/store/${vo.vendor?.slug || ""}`}
                          className="font-extrabold text-sm text-dark hover:text-primary transition"
                        >
                          Kiện #{idx + 1}: Xưởng {vendorName}
                        </Link>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-vendor-seal font-bold">
                          {vo.vendor?.badge || "Verified Merchant"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {vendorLocation} • Mã Kiện: <code className="font-semibold text-slate-700">{vo.subOrderNumber || vo.id.slice(0, 8)}</code>
                      </p>
                    </div>
                  </div>

                  {/* Courier Pill */}
                  <div className="flex items-center gap-2 text-xs">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-primary" />
                      <span>{courier.name}</span>
                      <button
                        onClick={() => handleCopy(courier.code)}
                        className="ml-1 text-slate-400 hover:text-primary"
                        title="Sao chép mã vận đơn"
                      >
                        {copiedCode === courier.code ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Items in this package */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Sản phẩm trong kiện hàng này ({vo.items.length} món)
                  </span>

                  <div className="divide-y divide-slate-100">
                    {vo.items.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 relative overflow-hidden flex-shrink-0">
                            <Image
                              src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=100&q=80"
                              alt="Thumbnail"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-dark">{item.productTitle}</p>
                            <p className="text-[11px] text-slate-400">
                              Số lượng: x{item.quantity} • Đơn giá: {formatVND(item.unitPrice)}
                            </p>
                          </div>
                        </div>
                        <span className="font-extrabold text-dark">
                          {formatVND(Number(item.unitPrice) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-medium border-t border-slate-100">
                    <span>Phí vận chuyển kiện xưởng:</span>
                    <span className="font-bold text-slate-700">{formatVND(vo.shippingFee)}</span>
                  </div>
                </div>

                {/* Real-Time Stage Progression Stepper */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-4">
                    Tiến Trình Xử Lý & Vận Chuyển Thời Gian Thực
                  </span>

                  <div className="relative">
                    {/* Progress Bar Line */}
                    <div className="absolute top-4 left-6 right-6 h-1 bg-slate-100 -z-0">
                      <div className="h-full bg-primary w-1/3 rounded-full transition-all duration-500" />
                    </div>

                    {/* Step Nodes */}
                    <div className="grid grid-cols-4 text-center relative z-10">
                      <div className="space-y-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mx-auto text-xs font-bold shadow-md">
                          ✓
                        </div>
                        <p className="text-xs font-bold text-dark">Đã Đặt Hàng</p>
                        <p className="text-[10px] text-slate-400">Hệ thống xác nhận</p>
                      </div>

                      <div className="space-y-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mx-auto text-xs font-bold shadow-md ring-4 ring-indigo-50 animate-pulse">
                          2
                        </div>
                        <p className="text-xs font-bold text-primary">Nghệ Nhân Đóng Gói</p>
                        <p className="text-[10px] text-slate-500">Cân chỉnh & đóng hộp</p>
                      </div>

                      <div className="space-y-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xs font-bold border border-slate-200">
                          3
                        </div>
                        <p className="text-xs font-semibold text-slate-400">Đang Vận Chuyển</p>
                        <p className="text-[10px] text-slate-400">Bưu cục trung chuyển</p>
                      </div>

                      <div className="space-y-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xs font-bold border border-slate-200">
                          4
                        </div>
                        <p className="text-xs font-semibold text-slate-400">Giao Thành Công</p>
                        <p className="text-[10px] text-slate-400">Ký nhận Escrow</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Package Quick Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3 print:hidden">
                  <Link
                    href={`/orders/${order.id}/dispute`}
                    className="text-xs font-semibold text-slate-500 hover:text-amber-600 transition flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Khiếu nại bưu kiện
                  </Link>
                  <Link
                    href={`/orders/${order.id}/review`}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-primary text-xs font-bold transition flex items-center gap-1.5 border border-indigo-100"
                  >
                    <Star className="w-3.5 h-3.5 fill-primary text-primary" /> Đánh giá xưởng
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial Audit Breakdown Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white card-border shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-dark uppercase tracking-wider">
          Đối Soát Tài Chính Đơn Hàng (Unified Cart Financial Audit)
        </h3>

        <div className="space-y-2 text-xs divide-y divide-slate-100">
          {order.vendorOrders.map((vo, i) => (
            <div key={vo.id} className="pt-2 flex items-center justify-between text-slate-600">
              <span>Kiện #{i + 1} ({vo.vendor?.shopName || "Xưởng"}): Tiền hàng + Phí ship</span>
              <span className="font-semibold text-dark">
                {formatVND(Number(vo.subtotalAmount) + Number(vo.shippingFee))}
              </span>
            </div>
          ))}

          <div className="pt-2 flex items-center justify-between text-emerald-600 font-semibold">
            <span>Voucher Sàn Vendora Escrow Promo:</span>
            <span>-50.000 ₫</span>
          </div>

          <div className="pt-3 flex items-center justify-between text-base font-extrabold text-primary">
            <span>Tổng Giá Trị Đơn Hàng (Đã Thanh Toán):</span>
            <span>{formatVND(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Action CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4 print:hidden">
        <Link
          href="/account/orders"
          className="px-6 py-3.5 rounded-xl bg-dark hover:bg-slate-800 text-white text-xs font-bold shadow-lg transition flex items-center gap-2"
        >
          <span>Xem Lịch Sử Mua Hàng</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/"
          className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 transition"
        >
          Tiếp Tục Khám Phá Sản Phẩm
        </Link>
      </div>

      {/* Map Telemetry Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl card-border max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-dark flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Bản Đồ Định Tuyến Bưu Kiện Trực Tiếp</span>
              </h4>
              <button onClick={() => setShowMapModal(false)} className="text-slate-400 hover:text-dark text-sm">
                ✕
              </button>
            </div>

            <div className="h-64 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center space-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center relative z-10">
                <Truck className="w-6 h-6 text-indigo-300 animate-pulse" />
              </div>
              <p className="font-bold text-xs text-white relative z-10">
                Đang Điều Phối Bưu Kiện Từ 2 Trung Tâm Logistics
              </p>
              <p className="text-[11px] text-slate-400 max-w-xs relative z-10">
                Hub 1 (Ba Đình, Hà Nội) & Hub 2 (Quận 1, TP.HCM) $\rightarrow$ Đích đến: {order.shippingAddress}
              </p>
            </div>

            <button
              onClick={() => setShowMapModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              Đóng Bản Đồ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
