"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Vendora Root Fatal Error]:", error);
  }, [error]);

  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] text-[#1E1E1E] font-sans px-4">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-6 text-amber-600 shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          Gián Đoạn Hệ Thống
        </h1>

        <p className="text-sm sm:text-base text-gray-600 max-w-md text-center mb-8">
          Ứng dụng Vendora đang gặp sự cố kết nối. Quý khách vui lòng thử tải lại trang.
        </p>

        {error.digest && (
          <p className="text-xs font-mono text-gray-500 mb-6 bg-gray-100 px-3 py-1 rounded">
            Digest: {error.digest}
          </p>
        )}

        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1E1E1E] text-white rounded-lg text-sm font-medium hover:bg-black transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Khởi động lại trang
        </button>
      </body>
    </html>
  );
}
