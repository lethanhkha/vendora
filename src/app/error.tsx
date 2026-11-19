"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error securely for telemetry / monitoring
    console.error("[Vendora Runtime Error]:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-12">
      <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-6 text-red-600 shadow-sm">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink mb-3">
        Đã có sự cố xảy ra
      </h1>

      <p className="text-muted text-sm sm:text-base max-w-md mx-auto mb-8">
        Hệ thống Vendora gặp gián đoạn tạm thời khi tải trang này. Chúng tôi đã ghi nhận sự cố để đội ngũ kỹ thuật xử lý.
      </p>

      {error.digest && (
        <div className="mb-8 px-3 py-1.5 bg-canvas-subtle border border-border rounded text-xs font-mono text-muted">
          Mã định danh lỗi: {error.digest}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={() => reset()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-ink text-canvas rounded-lg text-sm font-medium hover:bg-ink/90 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Thử tải lại
        </button>

        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-border text-ink rounded-lg text-sm font-medium hover:bg-canvas-subtle transition-colors shadow-sm"
        >
          <Home className="w-4 h-4" />
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
