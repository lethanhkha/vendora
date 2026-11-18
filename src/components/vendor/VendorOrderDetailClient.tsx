"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, Printer, CheckCircle2, Truck, Package, 
  MapPin, Clock, Phone, AlertCircle, Barcode, ShieldCheck
} from "lucide-react";
import { updateVendorOrderStatusAction } from "@/app/actions/order-lifecycle";

interface VendorOrderDetailClientProps {
  orderId: string;
  subOrderId?: string;
  subOrderNumber?: string;
  orderNumber?: string;
  recipientName?: string;
  recipientPhone?: string;
  shippingAddress?: string;
  carrier?: string;
  waybill?: string;
  subtotal?: string;
  shippingFee?: string;
}

export function VendorOrderDetailClient({
  orderId,
  subOrderId,
  subOrderNumber = "VND-9421-A",
  orderNumber = "VND-9421",
  recipientName = "Nguyễn Văn An",
  recipientPhone = "0987 654 321",
  shippingAddress = "Số 18, Ngõ 92 Phố Trúc Khê, Phường Láng Hạ, Quận Đống Đa, Hà Nội",
  carrier = "GHTK (Giao Hàng Tiết Kiệm)",
  waybill = "GHTK-KCB-9921",
  subtotal = "1.850.000 ₫",
  shippingFee = "35.000 ₫",
}: VendorOrderDetailClientProps) {
  const [currentStep, setCurrentStep] = useState<number>(2); // 1: Pending, 2: Packing, 3: Shipped, 4: Delivered
  const [packedConfirmed, setPackedConfirmed] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePrintLabel = () => {
    window.print();
  };

  const handleConfirmPacked = async () => {
    setIsUpdating(true);
    setCurrentStep(3);
    setPackedConfirmed(true);

    if (subOrderId) {
      await updateVendorOrderStatusAction(subOrderId, "SHIPPED");
    }
    setIsUpdating(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-8 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between print:hidden">
          <Link
            href="/vendor/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition"
          >
            <ArrowLeft className="w-4 h-4" /> Về Vendor Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintLabel}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-sm hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-primary" />
              <span>In Phiếu Gửi Hàng A6</span>
            </button>
            {!packedConfirmed && (
              <button
                onClick={handleConfirmPacked}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md shadow-indigo-100 transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Xác Nhận Đã Đóng Gói Xong</span>
              </button>
            )}
          </div>
        </div>

        {/* Order Identity Card */}
        <div className="bg-white rounded-3xl card-border p-6 sm:p-8 shadow-sm print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-primary border border-indigo-100">
                  Kiện Phụ Xưởng: {subOrderNumber}
                </span>
                <span className="text-xs text-slate-400">Đơn Gốc: #{orderNumber}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                Xử Lý Bưu Kiện Đơn Hàng Xưởng
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Đơn vị vận chuyển: <strong className="text-slate-800">{carrier}</strong> • Mã bưu gửi: <code className="font-mono font-bold text-primary">{waybill}</code>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Doanh Thu Kiện Này</span>
              <span className="text-xl font-extrabold text-primary">{subtotal}</span>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center justify-end gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Đã ký quỹ trong Escrow
              </p>
            </div>
          </div>

          {/* Stepper */}
          <div className="pt-6">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="space-y-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                  currentStep >= 1 ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                }`}>
                  ✓
                </div>
                <p className="text-xs font-bold text-slate-900">1. Tiếp Nhận Đơn</p>
                <p className="text-[10px] text-slate-400">Tự động phân tách</p>
              </div>

              <div className="space-y-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                  currentStep >= 2 ? "bg-primary text-white ring-4 ring-indigo-50 animate-pulse" : "bg-slate-100 text-slate-400"
                }`}>
                  2
                </div>
                <p className="text-xs font-bold text-primary">2. Đang Đóng Hộp</p>
                <p className="text-[10px] text-slate-400">Kiểm tra & bọc xốp</p>
              </div>

              <div className="space-y-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                  currentStep >= 3 ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                }`}>
                  3
                </div>
                <p className="text-xs font-bold text-slate-700">3. Bàn Giao Shipper</p>
                <p className="text-[10px] text-slate-400">Đã in tem dán A6</p>
              </div>

              <div className="space-y-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                  currentStep >= 4 ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                }`}>
                  4
                </div>
                <p className="text-xs font-bold text-slate-400">4. Giao Thành Công</p>
                <p className="text-[10px] text-slate-400">Giải ngân ký quỹ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Printable A6 Shipping Label (Standard Logistics Format) */}
        <div className="bg-white rounded-3xl card-border p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              <span>Bản Xem Trước Phiếu Gửi Hàng Chuẩn A6 (100x150mm)</span>
            </h3>
            <span className="text-xs text-slate-400">Bấm &quot;In Phiếu&quot; để xuất bản in nhiệt</span>
          </div>

          {/* Actual Printable Ticket Area */}
          <div className="max-w-md mx-auto border-2 border-dashed border-slate-300 p-6 rounded-2xl bg-white text-slate-900 font-sans print:border-black print:max-w-full print:p-0">
            {/* Header with Carrier Logo */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
              <div>
                <h4 className="text-base font-extrabold tracking-tight">VENDORA LOGISTICS</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Đối tác chuyển phát: {carrier}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-slate-100 border border-slate-300">
                  {subOrderNumber}
                </span>
              </div>
            </div>

            {/* Barcode & Waybill */}
            <div className="py-4 text-center border-b-2 border-slate-900">
              {/* Simulated crisp Barcode lines */}
              <div className="h-14 flex items-center justify-center gap-0.5 mx-auto max-w-xs">
                {[4, 2, 6, 2, 8, 3, 2, 5, 2, 7, 3, 2, 6, 4, 2, 5, 3, 6, 2, 8, 4, 3, 2, 5, 2, 7, 3, 4].map((w, idx) => (
                  <div
                    key={idx}
                    className="bg-black h-full"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
              <p className="font-mono text-sm font-extrabold tracking-widest mt-1.5">
                {waybill}
              </p>
            </div>

            {/* Sender & Recipient Blocks */}
            <div className="grid grid-cols-2 divide-x-2 divide-slate-900 border-b-2 border-slate-900 text-xs">
              <div className="p-3 space-y-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase">NGƯỜI GỬI (XƯỞNG TÁC TẠO):</p>
                <p className="font-bold text-slate-900">KeebCraft VN Workshop</p>
                <p className="text-[11px] text-slate-600">Ngõ 12 Đội Cấn, Ba Đình, Hà Nội</p>
                <p className="text-[11px] text-slate-600 font-mono">SĐT: 0912 888 999</p>
              </div>
              <div className="p-3 space-y-1 bg-slate-50/50">
                <p className="text-[9px] font-bold text-slate-400 uppercase">NGƯỜI NHẬN (KHÁCH HÀNG):</p>
                <p className="font-bold text-slate-900 text-sm">{recipientName}</p>
                <p className="text-[11px] text-slate-700 leading-snug">{shippingAddress}</p>
                <p className="text-[11px] text-slate-900 font-mono font-bold">SĐT: {recipientPhone}</p>
              </div>
            </div>

            {/* Contents & Instructions */}
            <div className="p-3 border-b-2 border-slate-900 text-xs space-y-1.5">
              <div className="flex justify-between font-bold">
                <span>Nội dung bưu kiện:</span>
                <span>Khối lượng: 1.500g</span>
              </div>
              <p className="text-slate-700 text-[11px]">
                1x Bàn Phím Cơ Gỗ Óc Chó FAS 75% (Krytox 205g0 Lubed) + Cáp mạ vàng + Keycap Puller.
              </p>
              <div className="p-2 rounded bg-amber-50 border border-amber-200 text-[10px] text-amber-900 font-bold">
                ⚠️ HÀNG THỦ CÔNG DỄ VỠ - XIN NHẸ TAY • CHO XEM HÀNG, KHÔNG THỬ
              </div>
            </div>

            {/* COD & Signatures */}
            <div className="grid grid-cols-2 divide-x-2 divide-slate-900 text-xs">
              <div className="p-3 text-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase">TIỀN THU HỘ (COD):</p>
                <p className="text-base font-extrabold text-slate-900">0 VNĐ</p>
                <p className="text-[10px] text-emerald-600 font-bold">(Đã thanh toán Escrow)</p>
              </div>
              <div className="p-3 text-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase">CHỮ KÝ NGƯỜI NHẬN:</p>
                <div className="h-8" />
                <p className="text-[9px] text-slate-400">(Ký và ghi rõ họ tên)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
