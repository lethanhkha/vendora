"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Landmark, DollarSign, Clock, ShieldCheck, 
  ArrowUpRight, Download, CheckCircle2, AlertCircle, ChevronRight, X
} from "lucide-react";

export function VendorPayoutsClient() {
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("14850000");
  const [bankAccount, setBankAccount] = useState("190366889988 - Techcombank (KeebCraft VN)");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const formatVND = (val: number | string) => {
    return new Intl.NumberFormat("vi-VN").format(Number(val)) + " ₫";
  };

  const ledgerRecords = [
    {
      id: "LED-01",
      subOrderNumber: "VND-9421-A",
      date: "14/11/2026",
      product: "Bàn Phím Cơ Gỗ Óc Chó FAS 75%",
      gross: 1850000,
      fee: 92500, // 5%
      net: 1757500,
      escrowReleaseDate: "29/11/2026",
      status: "ESCROW_PENDING",
      statusLabel: "Tạm Giữ Ký Quỹ (15 Ngày)",
    },
    {
      id: "LED-02",
      subOrderNumber: "VND-9382-B",
      date: "11/11/2026",
      product: "Bộ Keycap Gỗ Mun Hoa Handmade",
      gross: 950000,
      fee: 47500,
      net: 902500,
      escrowReleaseDate: "26/11/2026",
      status: "ESCROW_PENDING",
      statusLabel: "Tạm Giữ Ký Quỹ (15 Ngày)",
    },
    {
      id: "LED-03",
      subOrderNumber: "VND-9210-A",
      date: "28/10/2026",
      product: "Kê Tay Công Thái Học Gỗ Trắc",
      gross: 450000,
      fee: 22500,
      net: 427500,
      escrowReleaseDate: "12/11/2026",
      status: "AVAILABLE",
      statusLabel: "Khả Dụng (Đã Release)",
    },
    {
      id: "LED-04",
      subOrderNumber: "VND-9104-A",
      date: "15/10/2026",
      product: "Bàn Phím Cơ White Oak 65%",
      gross: 1650000,
      fee: 82500,
      net: 1567500,
      escrowReleaseDate: "30/10/2026",
      status: "WITHDRAWN",
      statusLabel: "Đã Rút Về Techcombank",
    },
  ];

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setWithdrawModalOpen(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-8 pb-20">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/vendor/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition"
          >
            <ArrowLeft className="w-4 h-4" /> Về Vendor Studio Dashboard
          </Link>

          <button
            onClick={() => setWithdrawModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md shadow-indigo-100 transition flex items-center gap-2"
          >
            <Landmark className="w-4 h-4" />
            <span>Yêu Cầu Rút Tiền Về VietQR</span>
          </button>
        </div>

        {/* Page Header */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            Minh Bạch Tài Chính &amp; Escrow
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Sổ Cái Doanh Thu &amp; Ký Quỹ Escrow
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Xưởng: <strong className="text-slate-800">KeebCraft VN</strong> • Đối soát tự động chuẩn từng đơn bưu kiện với cơ chế giữ tiền 15 ngày an toàn cho cả hai bên.
          </p>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Available */}
          <div className="bg-white rounded-3xl card-border p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Số Dư Khả Dụng</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{formatVND(14850000)}</p>
            <p className="text-[11px] text-emerald-600 font-semibold">
              Sẵn sàng rút về tài khoản ngân hàng
            </p>
          </div>

          {/* Escrow Pending */}
          <div className="bg-white rounded-3xl card-border p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Đang Ký Quỹ (Escrow)</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-amber-600">{formatVND(6420000)}</p>
            <p className="text-[11px] text-slate-400">
              Tạm giữ bảo chứng 15 ngày giao hàng
            </p>
          </div>

          {/* Lifetime GMV */}
          <div className="bg-white rounded-3xl card-border p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Tổng Doanh Thu Lũy Kế</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-primary flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{formatVND(42600000)}</p>
            <p className="text-[11px] text-primary font-semibold">
              Take-rate sàn Vendora: chỉ 5%
            </p>
          </div>

          {/* Withdrawn */}
          <div className="bg-white rounded-3xl card-border p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Đã Rút Thành Công</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-700">{formatVND(21330000)}</p>
            <p className="text-[11px] text-slate-400">
              Chuyển khoản tức thì 24/7
            </p>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white rounded-3xl card-border p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Chi Tiết Giao Dịch Từng Kiện Bưu Gửi</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mỗi kiện hàng có ngày đáo hạn giải phóng ký quỹ độc lập.
              </p>
            </div>

            <button
              onClick={() => alert("Đang xuất file Excel sổ cái đối soát...")}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" /> Xuất Báo Cáo Excel
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-3">Mã Kiện Phụ</th>
                  <th className="py-3 px-3">Ngày Đặt</th>
                  <th className="py-3 px-3">Tác Phẩm</th>
                  <th className="py-3 px-3">Tiền Hàng (Gross)</th>
                  <th className="py-3 px-3">Phí Sàn (5%)</th>
                  <th className="py-3 px-3 font-bold text-primary">Thực Nhận (Net)</th>
                  <th className="py-3 px-3">Ngày Hết Hạn Escrow</th>
                  <th className="py-3 px-3 text-right">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ledgerRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                      {item.subOrderNumber}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">{item.date}</td>
                    <td className="py-3.5 px-3 font-medium text-slate-800 max-w-xs truncate">
                      {item.product}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700">
                      {formatVND(item.gross)}
                    </td>
                    <td className="py-3.5 px-3 text-red-500 font-medium">
                      -{formatVND(item.fee)}
                    </td>
                    <td className="py-3.5 px-3 font-extrabold text-primary">
                      {formatVND(item.net)}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600">
                      {item.escrowReleaseDate}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.status === "AVAILABLE"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : item.status === "ESCROW_PENDING"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.statusLabel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Withdrawal Modal */}
        {withdrawModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl card-border max-w-md w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-primary" />
                  <h4 className="text-base font-extrabold text-slate-900">
                    Rút Tiền Về Ngân Hàng VietQR
                  </h4>
                </div>
                <button
                  onClick={() => setWithdrawModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {withdrawSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-500">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h5 className="text-lg font-bold text-slate-900">Yêu Cầu Rút Tiền Thành Công!</h5>
                  <p className="text-xs text-slate-500">
                    Khoản tiền <strong>{formatVND(withdrawAmount)}</strong> đang được xử lý chuyển khoản tức thì qua hệ thống VietQR NAPAS 24/7.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Số tiền muốn rút (Khả dụng: {formatVND(14850000)})
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        max={14850000}
                        min={100000}
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <button
                        type="button"
                        onClick={() => setWithdrawAmount("14850000")}
                        className="absolute right-3 top-2.5 text-xs text-primary font-bold hover:underline"
                      >
                        Tất Cả
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Tài khoản ngân hàng thụ hưởng
                    </label>
                    <select
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
                    >
                      <option value="190366889988 - Techcombank (KeebCraft VN)">
                        190366889988 - Techcombank (KeebCraft VN)
                      </option>
                      <option value="001100223344 - Vietcombank (Lê Thanh Kha)">
                        001100223344 - Vietcombank (Lê Thanh Kha)
                      </option>
                    </select>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-500 space-y-1">
                    <p className="flex justify-between">
                      <span>Phí rút tiền:</span>
                      <strong className="text-emerald-600">0 ₫ (Miễn phí)</strong>
                    </p>
                    <p className="flex justify-between">
                      <span>Thời gian nhận:</span>
                      <strong className="text-slate-800">Tức thì (NAPAS 24/7)</strong>
                    </p>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setWithdrawModalOpen(false)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md shadow-indigo-100 transition"
                    >
                      Xác Nhận Rút
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
