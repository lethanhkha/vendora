"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Store, Trash2, ShieldCheck, ArrowRight, CheckCircle2, CreditCard, Banknote, Sparkles, Truck, Tag, X, QrCode } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { submitCheckoutAction } from "@/app/actions/checkout";
import { validateVoucherAction } from "@/app/actions/voucher";

export default function CartPage() {
  const { items, summary, updateQuantity, removeFromCart, clearCart } = useCart();
  const [recipientName, setRecipientName] = useState("Minh Anh");
  const [recipientPhone, setRecipientPhone] = useState("0988 123 456");
  const [shippingAddress, setShippingAddress] = useState("Số 15, Phố Tràng Tiền, Hoàn Kiếm, Hà Nội");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "SANDBOX" | "VIETQR">("VIETQR");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Voucher state
  const [voucherCodeInput, setVoucherCodeInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; title: string; discountAmount: number } | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [voucherLoading, setVoucherLoading] = useState(false);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
  };

  const handleApplyVoucher = async (codeToApply?: string) => {
    const code = (codeToApply || voucherCodeInput).trim();
    if (!code) return;
    setVoucherLoading(true);
    setVoucherError(null);

    const res = await validateVoucherAction(code, summary.itemsSubtotal);
    setVoucherLoading(false);

    if (res.success && res.discountAmount) {
      setAppliedVoucher({
        code: res.code!,
        title: res.title!,
        discountAmount: res.discountAmount,
      });
      setVoucherCodeInput(res.code!);
    } else {
      setVoucherError(res.error || "Mã giảm giá không hợp lệ");
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCodeInput("");
    setVoucherError(null);
  };

  const finalGrandTotal = Math.max(0, summary.grandTotal - (appliedVoucher?.discountAmount || 0));

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await submitCheckoutAction({
        recipientName,
        recipientPhone,
        shippingAddress,
        paymentMethod,
        items,
        voucherDiscount: appliedVoucher?.discountAmount || 0,
      });

      if (res.success) {
        setCompletedOrder(res);
        clearCart();
      } else {
        setErrorMessage(res.error || "Có lỗi xảy ra");
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Success State Modal
  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Đặt Hàng & Tách Đơn Thành Công
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark mt-1">
            Mã Đơn Hàng Tổng: {completedOrder.orderNumber}
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Đơn hàng đã được tự động phân tách thành các đơn hàng con theo từng gian hàng.
          </p>
        </div>

        {/* Order Details Breakdown */}
        <div className="p-6 rounded-3xl bg-white card-border text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <span className="font-semibold text-slate-500">Hình thức thanh toán:</span>
            <span className="font-bold text-dark">
              {paymentMethod === "COD" ? "Thanh toán khi nhận hàng (COD)" : "Sandbox Mock (Đã Xác Nhận)"}
            </span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <span className="font-semibold text-slate-500">Tổng thanh toán:</span>
            <span className="text-base font-extrabold text-primary">
              {formatVND(Number(completedOrder.totalAmount))}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 text-xs text-vendor-seal space-y-1">
            <p className="font-bold">⚡ Kiến Trúc Tách Đơn Hàng (Order Splitting):</p>
            <p className="text-[11px] text-slate-600">
              Hệ thống đã bắn sự kiện <code className="bg-white px-1 rounded">OrderCreatedEvent</code> qua Outbox.
              Tồn kho của từng xưởng đã được khóa và trừ tức thời mà không xảy ra race condition.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/orders/${completedOrder.orderId}`}
            className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition shadow-glow flex items-center gap-1.5"
          >
            <Truck className="w-4 h-4" />
            <span>Theo Dõi Tách Kiện Real-Time (#{completedOrder.orderNumber})</span>
          </Link>
          <Link
            href="/account/orders"
            className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            Lịch Sử Mua Hàng
          </Link>
          <Link
            href="/"
            className="px-5 py-3 rounded-xl bg-white card-border text-slate-700 hover:text-primary text-xs font-bold transition"
          >
            Tiếp Tục Mua Sắm
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Store className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-dark">Giỏ hàng của bạn đang trống</h2>
        <p className="text-xs text-slate-500">
          Hãy khám phá các sản phẩm thủ công tinh hoa từ các gian hàng độc lập trên Vendora.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition shadow-sm"
        >
          <span>Khám Phá Ngay</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">
          Giỏ Hàng Hợp Nhất & Tách Đơn (Checkout)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Hệ thống tự động phân tách đơn hàng theo từng xưởng độc lập để bạn theo dõi minh bạch
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Cart Items Grouped by Vendor */}
        <div className="lg:col-span-8 space-y-6">
          {summary.groups.map((group) => (
            <div
              key={group.vendorId}
              className="bg-white rounded-3xl card-border p-6 shadow-soft space-y-4"
            >
              {/* Vendor Group Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-50 text-vendor-seal">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-dark">{group.vendorName}</h3>
                    <p className="text-[10px] text-slate-400">
                      Giao từ: {group.vendorLocation} • Phí ship xưởng: {formatVND(group.shippingFee)}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-slate-500">
                  {group.items.length} món
                </span>
              </div>

              {/* Items in this Vendor Group */}
              <div className="divide-y divide-slate-100">
                {group.items.map((item) => (
                  <div key={item.skuId} className="py-3.5 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden relative bg-slate-100 flex-shrink-0 card-border">
                      <Image
                        src={item.imageUrl || "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=150&q=80"}
                        alt={item.productTitle}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-dark truncate">
                        {item.productTitle}
                      </h4>
                      {item.attributes && (
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {Object.values(item.attributes).join(" • ")}
                        </p>
                      )}
                      <p className="text-xs font-extrabold text-primary mt-1">
                        {formatVND(Number(item.price))}
                      </p>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center card-border rounded-xl bg-white overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.skuId, item.quantity - 1)}
                        className="px-2.5 py-1 text-xs font-bold text-slate-500 hover:bg-slate-50"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-dark">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.skuId, item.quantity + 1)}
                        className="px-2.5 py-1 text-xs font-bold text-slate-500 hover:bg-slate-50"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.skuId)}
                      className="p-2 text-slate-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Vendor Subtotal */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Tạm tính gói hàng {group.vendorName}:
                </span>
                <span className="font-bold text-dark">
                  {formatVND(group.total)} (đã gồm phí ship)
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Checkout Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <form
            onSubmit={handleCheckout}
            className="bg-white rounded-3xl card-border p-6 shadow-soft space-y-6 sticky top-24"
          >
            <h3 className="text-base font-bold text-dark pb-3 border-b border-slate-100">
              Thông Tin Nhận Hàng & Thanh Toán
            </h3>

            {/* Address fields */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Tên người nhận</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl card-border bg-slate-50 text-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Số điện thoại</label>
                <input
                  type="text"
                  required
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl card-border bg-slate-50 text-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Địa chỉ giao hàng</label>
                <textarea
                  required
                  rows={2}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl card-border bg-slate-50 text-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block">Phương thức thanh toán:</label>
              
              <div
                onClick={() => setPaymentMethod("VIETQR")}
                className={`p-3 rounded-xl card-border cursor-pointer flex items-center justify-between text-xs transition ${
                  paymentMethod === "VIETQR"
                    ? "border-primary bg-indigo-50/50 text-primary font-bold shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-primary" />
                  <div>
                    <span className="block font-bold">Chuyển khoản VietQR 24/7 (Khuyên Dùng)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Quét mã QR tự động qua ứng dụng mọi ngân hàng</span>
                  </div>
                </div>
                {paymentMethod === "VIETQR" && <CheckCircle2 className="w-4 h-4 text-primary" />}
              </div>

              <div
                onClick={() => setPaymentMethod("COD")}
                className={`p-3 rounded-xl card-border cursor-pointer flex items-center justify-between text-xs transition ${
                  paymentMethod === "COD"
                    ? "border-primary bg-indigo-50/50 text-primary font-bold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4" />
                  <span>Thanh toán khi nhận hàng (COD)</span>
                </div>
                {paymentMethod === "COD" && <CheckCircle2 className="w-4 h-4 text-primary" />}
              </div>

              <div
                onClick={() => setPaymentMethod("SANDBOX")}
                className={`p-3 rounded-xl card-border cursor-pointer flex items-center justify-between text-xs transition ${
                  paymentMethod === "SANDBOX"
                    ? "border-primary bg-indigo-50/50 text-primary font-bold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Sandbox Mock (Giả lập thanh toán ngay)</span>
                </div>
                {paymentMethod === "SANDBOX" && <CheckCircle2 className="w-4 h-4 text-primary" />}
              </div>
            </div>

            {/* Voucher Section */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-primary" />
                <span>Mã giảm giá & Voucher:</span>
              </label>

              {appliedVoucher ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-700 block">{appliedVoucher.code}</span>
                    <span className="text-[11px] text-emerald-600">
                      {appliedVoucher.title} (-{formatVND(appliedVoucher.discountAmount)})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveVoucher}
                    className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nhập mã (KEEB50K...)"
                      value={voucherCodeInput}
                      onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 rounded-xl card-border bg-slate-50 text-xs text-dark uppercase font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      disabled={voucherLoading || !voucherCodeInput.trim()}
                      onClick={() => handleApplyVoucher()}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold disabled:opacity-40 transition"
                    >
                      {voucherLoading ? "..." : "Áp dụng"}
                    </button>
                  </div>
                  {voucherError && (
                    <p className="text-[11px] text-red-500 font-medium">{voucherError}</p>
                  )}
                  {/* Quick voucher pill suggestions */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleApplyVoucher("KEEB50K")}
                      className="px-2 py-0.5 rounded-md bg-purple-50 text-[10px] font-bold text-primary border border-purple-200 hover:bg-purple-100"
                    >
                      KEEB50K (-50k)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyVoucher("VENDORA50")}
                      className="px-2 py-0.5 rounded-md bg-purple-50 text-[10px] font-bold text-primary border border-purple-200 hover:bg-purple-100"
                    >
                      VENDORA50 (-50k)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Tiền hàng ({summary.totalItems} món):</span>
                <span>{formatVND(summary.itemsSubtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Phí ship tổng ({summary.groups.length} xưởng):</span>
                <span>{formatVND(summary.totalShippingFee)}</span>
              </div>
              {appliedVoucher && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Voucher giảm giá ({appliedVoucher.code}):</span>
                  <span>-{formatVND(appliedVoucher.discountAmount)}</span>
                </div>
              )}
              {summary.platformDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Ưu đãi gom đơn VENDORA2025:</span>
                  <span>-{formatVND(summary.platformDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-dark pt-2 border-t border-slate-100">
                <span>Tổng Thanh Toán:</span>
                <span className="text-primary">{formatVND(finalGrandTotal)}</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-md transition-all active:scale-98 disabled:bg-slate-300"
            >
              {isSubmitting
                ? "Đang xử lý tách đơn..."
                : `Đặt Hàng (${summary.groups.length} Shop Tự Động) • ${formatVND(finalGrandTotal)}`}
            </button>

            <div className="flex items-center gap-2 justify-center text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Bảo vệ thanh toán Escrow 15 ngày bởi Vendora</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
