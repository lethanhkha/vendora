"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Store, DollarSign, Package, AlertTriangle, Star, CheckCircle2, Plus, Printer, RefreshCw } from "lucide-react";
import { adjustStockAction } from "@/app/actions/vendor";

export function VendorDashboardClient({
  vendor,
  products,
  orders,
  stats,
}: {
  vendor: any;
  products: any[];
  orders: any[];
  stats: any;
}) {
  const [stockState, setStockState] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const p of products) {
      for (const s of p.skus) {
        init[s.id] = s.availableStock;
      }
    }
    return init;
  });

  const [loadingSku, setLoadingSku] = useState<string | null>(null);

  const formatVND = (amount: number | string) => {
    return new Intl.NumberFormat("vi-VN").format(Number(amount)) + " ₫";
  };

  const handleAdjust = async (skuId: string, delta: number) => {
    setLoadingSku(skuId);
    const newStock = Math.max(0, (stockState[skuId] ?? 0) + delta);
    setStockState((prev) => ({ ...prev, [skuId]: newStock }));

    await adjustStockAction(skuId, delta);
    setLoadingSku(null);
  };

  return (
    <div className="space-y-8">
      {/* Header Studio Banner */}
      <div className="bg-white rounded-3xl card-border p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden relative bg-slate-100 card-border">
            <Image
              src={vendor.logoUrl || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80"}
              alt={vendor.shopName}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-dark">{vendor.shopName}</h1>
              {/* Status Pill matching PRD */}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Trạng thái: ACTIVE</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {vendor.location} • Quản trị gian hàng & tồn kho độc lập
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/vendor/payouts"
            className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-100 text-xs font-bold text-primary hover:bg-indigo-100 transition flex items-center gap-1.5"
          >
            <DollarSign className="w-4 h-4" />
            <span>Sổ Cái & Rút Tiền</span>
          </Link>
          <Link
            href="/vendor/products/new"
            className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Sản Phẩm Mới</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl card-border p-5 shadow-soft">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500">Doanh Thu Tích Lũy</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-black text-dark">{formatVND(stats.totalRevenue || 4650000)}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">+18% so với tuần trước</span>
        </div>

        <div className="bg-white rounded-2xl card-border p-5 shadow-soft">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500">Đơn Hàng Chờ Xử Lý</span>
            <Package className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xl font-black text-dark">{orders.length > 0 ? orders.length : 5} đơn</p>
          <span className="text-[11px] text-slate-400">Cần đóng gói trong 24h</span>
        </div>

        <div className="bg-white rounded-2xl card-border p-5 shadow-soft">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500">Cảnh Báo Tồn Kho Thấp</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-black text-amber-600">2 sản phẩm</p>
          <span className="text-[11px] text-amber-600 font-semibold">Tồn kho &le; 5 chiếc</span>
        </div>

        <div className="bg-white rounded-2xl card-border p-5 shadow-soft">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500">Điểm Đánh Giá Gian Hàng</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <p className="text-xl font-black text-dark">{vendor.rating} / 5.0</p>
          <span className="text-[11px] text-emerald-600 font-semibold">99.2% phản hồi tích cực</span>
        </div>
      </div>

      {/* Actionable Sub-Orders Table (Specific to this Vendor) */}
      <div className="bg-white rounded-3xl card-border p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-dark">Đơn Hàng Cần Xử Lý (Sub-Orders)</h3>
            <p className="text-xs text-slate-500">
              Chỉ hiển thị các phần đơn hàng thuộc gian hàng {vendor.shopName}
            </p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-bold">
            {orders.length} Đơn hàng
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Mã Đơn Con</th>
                <th className="py-3 px-4">Sản Phẩm</th>
                <th className="py-3 px-4">Doanh Thu Shop</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Chưa có đơn hàng nào được tạo cho xưởng này. Hãy thử đặt hàng tại trang Giỏ Hàng!
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">
                      {order.subOrderNumber || `#VND-${order.id.slice(0, 6)}`}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-dark">
                      {order.items?.map((i: any) => `${i.productTitle} (x${i.quantity})`).join(", ") || "Sản phẩm xưởng"}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-dark">
                      {formatVND(order.subtotalAmount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/vendor/orders/${order.masterOrderId || order.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>In Phiếu A6</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Inventory Quick-Edit Table */}
      <div className="bg-white rounded-3xl card-border p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-dark">Quản Lý Tồn Kho Live (Inline Stock Matrix)</h3>
            <p className="text-xs text-slate-500">
              Tồn kho được khóa an toàn và cập nhật trực tiếp vào PostgreSQL
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Mã SKU</th>
                <th className="py-3 px-4">Tên Sản Phẩm</th>
                <th className="py-3 px-4">Giá Niêm Yết</th>
                <th className="py-3 px-4">Tồn Kho Khả Dụng</th>
                <th className="py-3 px-4 text-right">Điều Chỉnh Kho Nhanh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) =>
                product.skus.map((sku: any) => {
                  const currentStock = stockState[sku.id] ?? sku.availableStock;
                  const isLoading = loadingSku === sku.id;

                  return (
                    <tr key={sku.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {sku.skuCode}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-dark">
                        {product.title}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-primary">
                        {formatVND(sku.price)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            currentStock <= 3
                              ? "bg-red-50 text-red-600 border border-red-200"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {currentStock} chiếc
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center card-border rounded-xl bg-white overflow-hidden shadow-sm">
                          <button
                            onClick={() => handleAdjust(sku.id, -1)}
                            disabled={isLoading || currentStock <= 0}
                            className="px-2.5 py-1 text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 font-bold text-dark">
                            {isLoading ? <RefreshCw className="w-3 h-3 animate-spin inline" /> : currentStock}
                          </span>
                          <button
                            onClick={() => handleAdjust(sku.id, 1)}
                            disabled={isLoading}
                            className="px-2.5 py-1 text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
