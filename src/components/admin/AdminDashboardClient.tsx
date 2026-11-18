"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShieldAlert, ShieldCheck, CheckCircle2, XCircle, AlertTriangle, 
  DollarSign, Store, Activity, ArrowLeft, RefreshCw, Eye, Sparkles, Filter
} from "lucide-react";
import { resolveDisputeAction } from "@/app/actions/order-lifecycle";

interface AdminDashboardClientProps {
  initialDisputes?: any[];
}

export function AdminDashboardClient({ initialDisputes = [] }: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"DISPUTES" | "APPLICATIONS" | "OUTBOX">("DISPUTES");

  // Normalize initial disputes if provided from database
  const mappedDbDisputes = (initialDisputes || []).map((d) => ({
    id: d.id,
    disputeNumber: d.disputeNumber || d.id,
    orderNumber: "VND-ORDER",
    subOrderNumber: d.subOrderNumber || "VND-SUB",
    buyerName: d.buyerName || "Khách hàng",
    buyerEmail: d.buyerEmail || "buyer@vendora.vn",
    vendorName: "Xưởng chế tác",
    amount: Number(d.subtotalAmount) || 1850000,
    reason: d.description,
    image: Array.isArray(d.photos) && d.photos.length > 0 ? d.photos[0] : "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80",
    status: d.status === "OPEN" ? "OPEN" : d.status === "RESOLVED_REFUND" ? "REFUNDED" : "REJECTED",
    desired: d.desiredResolution === "REFUND_VIETQR" ? "Hoàn tiền 100% qua VietQR" : "Đổi sản phẩm mới",
    createdAt: new Date(d.createdAt).toLocaleString("vi-VN"),
  }));

  const sampleDisputes = [
    {
      id: "DSP-8821",
      disputeNumber: "DSP-8821",
      orderNumber: "VND-9421",
      subOrderNumber: "VND-9421-A",
      buyerName: "Minh Anh",
      buyerEmail: "buyer@vendora.vn",
      vendorName: "KeebCraft VN",
      amount: 1850000,
      reason: "Bàn phím cơ bị nứt góc gỗ do va đập vận chuyển",
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80",
      status: "OPEN",
      desired: "Hoàn tiền 100% qua VietQR",
      createdAt: "14/11/2026 14:30",
    },
    {
      id: "DSP-8790",
      disputeNumber: "DSP-8790",
      orderNumber: "VND-9120",
      subOrderNumber: "VND-9120-B",
      buyerName: "Trần Hoàng Long",
      buyerEmail: "longth@gmail.com",
      vendorName: "Aura Saigon Leather",
      amount: 450000,
      reason: "Giao sai màu sắc tấm lót bàn (đặt màu Nâu Sáp, nhận màu Đen)",
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=400&q=80",
      status: "OPEN",
      desired: "Đổi mới sản phẩm đúng màu",
      createdAt: "13/11/2026 10:15",
    },
  ];

  // Dispute resolution states
  const [disputes, setDisputes] = useState(
    mappedDbDisputes.length > 0 ? mappedDbDisputes : sampleDisputes
  );

  const [applications, setApplications] = useState([
    {
      id: "APP-01",
      shopName: "Gốm Mộc Phù Lãng",
      owner: "Phạm Văn Đức",
      location: "Bắc Ninh",
      specialty: "Gốm đất nung truyền thống men tro",
      status: "PENDING",
    },
    {
      id: "APP-02",
      shopName: "Mộc Miên Studio",
      owner: "Vũ Thị Mai",
      location: "Đà Lạt",
      specialty: "Tranh khắc gỗ & phụ kiện decor thông đỏ",
      status: "PENDING",
    },
  ]);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
  };

  const handleResolveDispute = async (disputeId: string, resolution: "REFUND_BUYER" | "RELEASE_VENDOR") => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status: resolution === "REFUND_BUYER" ? "REFUNDED" : "REJECTED",
            }
          : d
      )
    );

    await resolveDisputeAction(disputeId, resolution);
  };

  const handleApproveApplication = (appId: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: "APPROVED" } : a))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-8 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                Super Admin
              </span>
              <span className="text-xs text-slate-500 font-medium">Trung Tâm Điều Hành Vendora</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              Giám Sát Toàn Sàn &amp; Trọng Tài Escrow
            </h1>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-primary transition self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white card-border shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Về Marketplace Storefront
          </Link>
        </div>

        {/* 4 Super Admin High-Level Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-3xl card-border p-6 shadow-sm space-y-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tổng GMV Toàn Sàn
            </span>
            <p className="text-2xl font-black text-slate-900">{formatVND(188500000)}</p>
            <p className="text-[11px] text-emerald-600 font-semibold">+24.5% tăng trưởng tháng này</p>
          </div>

          <div className="bg-white rounded-3xl card-border p-6 shadow-sm space-y-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Doanh Thu Phí Sàn (5%)
            </span>
            <p className="text-2xl font-black text-primary">{formatVND(9425000)}</p>
            <p className="text-[11px] text-slate-500 font-semibold">Mô hình Take-rate minh bạch</p>
          </div>

          <div className="bg-white rounded-3xl card-border p-6 shadow-sm space-y-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Quỹ Bảo Chứng Escrow Vault
            </span>
            <p className="text-2xl font-black text-amber-600">{formatVND(46200000)}</p>
            <p className="text-[11px] text-amber-600 font-semibold">100% Solvency (Tạm giữ an toàn)</p>
          </div>

          <div className="bg-white rounded-3xl card-border p-6 shadow-sm space-y-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Vụ Tranh Chấp Cần Phân Xử
            </span>
            <p className="text-2xl font-black text-red-600">
              {disputes.filter((d) => d.status === "OPEN").length} Vụ Mở
            </p>
            <p className="text-[11px] text-red-500 font-semibold">Cần giải quyết trong 24h</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab("DISPUTES")}
            className={`pb-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === "DISPUTES"
                ? "border-primary text-primary"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Hội Đồng Trọng Tài Khiếu Nại</span>
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs">
              {disputes.filter((d) => d.status === "OPEN").length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("APPLICATIONS")}
            className={`pb-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === "APPLICATIONS"
                ? "border-primary text-primary"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Duyệt Xưởng Chế Tác Mới</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-primary text-xs">
              {applications.filter((a) => a.status === "PENDING").length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("OUTBOX")}
            className={`pb-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === "OUTBOX"
                ? "border-primary text-primary"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Kiến Trúc Outbox &amp; Concurrency</span>
          </button>
        </div>

        {/* Tab 1: Dispute Arbitration */}
        {activeTab === "DISPUTES" && (
          <div className="space-y-6">
            {disputes.map((dispute) => (
              <div
                key={dispute.id}
                className="bg-white rounded-3xl card-border p-6 sm:p-8 shadow-sm space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {dispute.id}
                        </span>
                        <span className="text-xs text-slate-400">• Đơn: #{dispute.orderNumber} ({dispute.subOrderNumber})</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Thời gian gửi: {dispute.createdAt}</p>
                    </div>
                  </div>

                  <div>
                    {dispute.status === "OPEN" ? (
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                        Đang Chờ Trọng Tài Phân Xử
                      </span>
                    ) : dispute.status === "REFUNDED" ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                        ✓ Đã Hoàn Tiền 100% Cho Người Mua
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                        ✕ Bác Bỏ - Đã Giải Ngân Cho Xưởng
                      </span>
                    )}
                  </div>
                </div>

                {/* Dispute Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Parties */}
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <p className="text-slate-400 uppercase text-[10px] font-bold">Người Mua:</p>
                      <p className="font-bold text-slate-900">{dispute.buyerName}</p>
                      <p className="text-slate-500">{dispute.buyerEmail}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                      <p className="text-slate-400 uppercase text-[10px] font-bold">Xưởng Bị Khiếu Nại:</p>
                      <p className="font-bold text-slate-900">{dispute.vendorName}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                      <p className="text-slate-400 uppercase text-[10px] font-bold">Số Tiền Tạm Giữ Escrow:</p>
                      <p className="font-extrabold text-primary text-sm">{formatVND(dispute.amount)}</p>
                    </div>
                  </div>

                  {/* Incident Description */}
                  <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <p className="text-slate-400 uppercase text-[10px] font-bold">Lý Do &amp; Bằng Chứng Khiếu Nại:</p>
                    <p className="font-semibold text-slate-800 leading-relaxed">
                      &quot;{dispute.reason}&quot;
                    </p>
                    <div className="pt-2">
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">Phương án mong muốn:</span>
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-primary font-bold inline-block">
                        {dispute.desired}
                      </span>
                    </div>
                  </div>

                  {/* Evidence Photo */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                    <p className="text-slate-400 uppercase text-[10px] font-bold">Ảnh Chụp Bưu Kiện Khi Nhận:</p>
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200">
                      <Image src={dispute.image} alt="Evidence" fill className="object-cover" />
                    </div>
                  </div>
                </div>

                {/* Arbitration Decision Actions */}
                {dispute.status === "OPEN" && (
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
                    <button
                      onClick={() => handleResolveDispute(dispute.id, "RELEASE_VENDOR")}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4 text-slate-400" />
                      <span>Bác Bỏ Khiếu Nại (Giải Ngân Cho Xưởng)</span>
                    </button>

                    <button
                      onClick={() => handleResolveDispute(dispute.id, "REFUND_BUYER")}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-100 transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Xác Nhận Lỗi • Hoàn Tiền 100% Cho Người Mua</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Merchant Applications */}
        {activeTab === "APPLICATIONS" && (
          <div className="bg-white rounded-3xl card-border p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Danh Sách Hồ Sơ Đăng Ký Xưởng Mới
            </h3>

            <div className="divide-y divide-slate-100">
              {applications.map((app) => (
                <div key={app.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900">{app.shopName}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-primary font-bold">
                        {app.location}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Đại diện: <strong>{app.owner}</strong> • Chuyên môn: {app.specialty}
                    </p>
                  </div>

                  <div>
                    {app.status === "APPROVED" ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã Kích Hoạt Verified
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApproveApplication(app.id)}
                        className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm transition"
                      >
                        Phê Duyệt &amp; Cấp Huy Hiệu Artisan
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Outbox & Concurrency */}
        {activeTab === "OUTBOX" && (
          <div className="bg-white rounded-3xl card-border p-6 sm:p-8 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>Giám Sát Kiến Trúc Transactional Outbox &amp; Concurrency</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Outbox Events Processed:</span>
                <p className="text-xl font-bold text-slate-900">100% Thành Công</p>
                <p className="text-emerald-600 font-semibold">Tự động trừ kho qua domain events</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Cơ Chế Khóa Tồn Kho:</span>
                <p className="text-xl font-bold text-slate-900">Optimistic Lock (v1)</p>
                <p className="text-primary font-semibold">Bảo vệ tranh chấp hàng tồn số lượng ít</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Tách Đơn Tự Động:</span>
                <p className="text-xl font-bold text-slate-900">Active (Multi-Vendor)</p>
                <p className="text-slate-500 font-semibold">Mỗi xưởng nhận một sub-order riêng</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
