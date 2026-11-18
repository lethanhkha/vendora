"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Package, X, ArrowRight, Sparkles } from "lucide-react";

interface LiveOrderNotification {
  id: string;
  subOrderNumber: string | null;
  subtotalAmount: string;
  recipientName: string | null;
  createdAt: string;
}

export function LiveOrderNotifier({
  vendorId,
  onNewOrder,
}: {
  vendorId: string;
  onNewOrder?: () => void;
}) {
  const router = useRouter();
  const [activeNotification, setActiveNotification] = useState<LiveOrderNotification | null>(null);
  const [lastCheck, setLastCheck] = useState<string>(() => new Date().toISOString());

  const formatVND = (amount: number | string) => {
    return new Intl.NumberFormat("vi-VN").format(Number(amount)) + " ₫";
  };

  useEffect(() => {
    if (!vendorId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/vendor/live-orders?vendorId=${vendorId}&since=${encodeURIComponent(lastCheck)}`
        );
        const data = await res.json();

        if (data.success && data.orders && data.orders.length > 0) {
          const newest = data.orders[0];
          setActiveNotification(newest);
          setLastCheck(data.timestamp || new Date().toISOString());

          if (onNewOrder) {
            onNewOrder();
          } else {
            router.refresh();
          }
        }
      } catch (err) {
        // Silent polling error
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [vendorId, lastCheck, onNewOrder, router]);

  if (!activeNotification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-in">
      <div className="bg-white rounded-2xl card-border p-4 shadow-2xl border-2 border-primary/30 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-vendor-seal to-emerald-400" />

        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-vendor-seal flex items-center justify-center flex-shrink-0 border border-purple-100">
            <Bell className="w-5 h-5 animate-pulse text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                ĐƠN HÀNG MỚI!
              </span>
              <Sparkles className="w-3.5 h-3.5 text-accent-amber" />
            </div>

            <h4 className="text-xs font-bold text-dark mt-1 truncate">
              Kiện #{activeNotification.subOrderNumber || activeNotification.id.slice(0, 8)}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Khách hàng: <strong>{activeNotification.recipientName || "Khách mua"}</strong> •{" "}
              <span className="text-primary font-bold">
                {formatVND(activeNotification.subtotalAmount)}
              </span>
            </p>

            <div className="flex items-center gap-2 mt-2.5">
              <Link
                href={`/vendor/orders/${activeNotification.id}`}
                onClick={() => setActiveNotification(null)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-primary hover:bg-primary-hover text-white text-[11px] font-bold shadow-sm transition"
              >
                <span>Xem Ngay</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                type="button"
                onClick={() => setActiveNotification(null)}
                className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-600 text-[11px] font-semibold"
              >
                Bỏ qua
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveNotification(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
