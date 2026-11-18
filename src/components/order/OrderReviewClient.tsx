"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Star, ShieldCheck, Sparkles, UploadCloud, CheckCircle2, 
  ArrowLeft, Gift, Lock, Camera, ThumbsUp, Check
} from "lucide-react";
import { submitReviewAction } from "@/app/actions/order-lifecycle";

interface OrderReviewClientProps {
  orderId: string;
  orderNumber?: string;
  productId?: string;
  vendorOrderId?: string;
  productTitle?: string;
}

export function OrderReviewClient({
  orderId,
  orderNumber = "VND-9421",
  productId,
  vendorOrderId,
  productTitle = "Bàn Phím Cơ Gỗ Óc Chó FAS 75%",
}: OrderReviewClientProps) {
  const [overallRating, setOverallRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [craftQualityRating, setCraftQualityRating] = useState<number>(5);
  const [soundRating, setSoundRating] = useState<number>(5);
  const [packagingRating, setPackagingRating] = useState<number>(5);
  
  const [reviewText, setReviewText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80",
  ]);

  const ratingDescriptions: Record<number, string> = {
    1: "Rất không hài lòng (1/5)",
    2: "Chưa đạt kỳ vọng (2/5)",
    3: "Chất lượng tạm ổn (3/5)",
    4: "Rất hài lòng, đúng mô tả (4/5)",
    5: "Tuyệt vời, vượt kỳ vọng! (5/5)",
  };

  const handleAddDemoPhoto = () => {
    if (uploadedPhotos.length < 5) {
      setUploadedPhotos((prev) => [
        ...prev,
        "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=400&q=80",
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (productId) {
      await submitReviewAction({
        productId,
        vendorOrderId,
        rating: overallRating,
        craftRating: craftQualityRating,
        reviewText: reviewText || "Sản phẩm chế tác rất tinh xảo, gỗ thơm tự nhiên và hoàn thiện sắc sảo.",
        images: uploadedPhotos,
        isAnonymous,
      });
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50/70 py-16 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl card-border p-8 sm:p-10 shadow-xl text-center animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-6 text-emerald-500 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
            Cảm Ơn Đánh Giá Của Bạn!
          </h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Đánh giá của bạn đã được ghi nhận. Toàn bộ tiền ký quỹ Escrow cho đơn hàng này đã được kích hoạt giải ngân sớm cho xưởng <strong>KeebCraft VN</strong>.
          </p>

          {/* Reward Voucher Box */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-4 mb-8 text-left flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Gift className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wider">Phần Thưởng Đánh Giá</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">Voucher 50.000 ₫ cho đơn hàng kế tiếp</p>
              <p className="text-xs text-slate-500 mt-0.5">Mã: <code className="bg-white px-2 py-0.5 rounded font-mono font-bold text-indigo-600 border border-indigo-200">KEEB50K</code> • Hạn dùng 30 ngày</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/orders/${orderId}`}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold transition text-center"
            >
              Xem Chi Tiết Đơn Hàng
            </Link>
            <Link
              href="/account/orders"
              className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-md shadow-indigo-100 transition text-center"
            >
              Quản Lý Đơn Mua
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Navigation back */}
        <Link
          href={`/orders/${orderId}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Quay Lại Đơn Hàng
        </Link>

        <div className="bg-white rounded-3xl card-border p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="border-b border-slate-100 pb-5 mb-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-primary border border-indigo-100">
                  Đánh Giá Đơn Mua
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1.5">
                  Đánh Giá Đơn #{orderNumber}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Xưởng chế tác: <strong className="text-slate-800">KeebCraft VN</strong> • Ba Đình, Hà Nội
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary flex-shrink-0">
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </div>

          {/* Product Preview Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-8">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 relative flex-shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80"
                alt="Product thumbnail"
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 truncate">
                Bàn Phím Cơ Gỗ Óc Chó FAS Tự Nhiên 75%
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Switch: Krytox 205g0 Lubed • Gasket Mount • 1.850.000 ₫
              </p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Giao thành công qua GHTK
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Overall Star Rating */}
            <div className="text-center py-4 bg-indigo-50/30 rounded-2xl border border-indigo-50">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                Mức Độ Hài Lòng Chung
              </label>

              <div className="flex items-center justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setOverallRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-200 hover:scale-110 transition-transform focus:outline-none"
                  >
                    <Star
                      className={`w-9 h-9 ${
                        (hoverRating || overallRating) >= star
                          ? "text-amber-400 fill-amber-400 drop-shadow-sm"
                          : "text-slate-200"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <p className="text-sm font-bold text-primary">
                {ratingDescriptions[hoverRating || overallRating]}
              </p>
            </div>

            {/* Criteria Breakdown */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Chấm Điểm Chi Tiết
              </h4>

              {/* Criterion 1 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-semibold text-slate-700">Chất lượng hoàn thiện gỗ &amp; linh kiện:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setCraftQualityRating(s)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          craftQualityRating >= s ? "text-amber-400 fill-amber-400" : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Criterion 2 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-semibold text-slate-700">Độ êm &amp; âm thanh gõ switch thocky:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSoundRating(s)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          soundRating >= s ? "text-amber-400 fill-amber-400" : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Criterion 3 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-semibold text-slate-700">Đóng gói an toàn &amp; vận chuyển nhanh:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPackagingRating(s)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          packagingRating >= s ? "text-amber-400 fill-amber-400" : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Review Textarea */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Cảm Nhận Thực Tế Của Bạn
              </label>
              <textarea
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Chia sẻ cảm nhận về âm thanh thocky, độ đầm của gỗ óc chó nguyên khối và dịch vụ bảo hành của xưởng KeebCraft VN..."
                className="w-full p-3.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 resize-none leading-relaxed"
              />
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400">Gợi ý nhanh:</span>
                {["Gỗ hoàn thiện rất mượt", "Switch lube êm không sạn", "Đóng gói bọt khí dày dặn"].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setReviewText((prev) => prev ? `${prev}, ${chip.toLowerCase()}` : chip)}
                    className="text-[10px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full transition"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo & Video Upload */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Hình Ảnh &amp; Video Thực Tế ({uploadedPhotos.length}/5)
              </label>
              
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {uploadedPhotos.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                    <Image src={url} alt={`Upload ${idx}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setUploadedPhotos((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {uploadedPhotos.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddDemoPhoto}
                    className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-primary flex flex-col items-center justify-center text-slate-400 hover:text-primary transition bg-slate-50/50"
                  >
                    <Camera className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold">Thêm ảnh</span>
                  </button>
                )}
              </div>
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-xs font-bold text-slate-800">Đánh giá ẩn danh</p>
                  <p className="text-[11px] text-slate-400">Tên của bạn sẽ hiển thị dạng M***h trên trang sản phẩm</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
              />
            </div>

            {/* Escrow Incentive Notice */}
            <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-start gap-3">
              <Gift className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-slate-900">Bảo Chứng Ký Quỹ &amp; Quà Tặng Đánh Giá</h5>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  Khi bạn gửi đánh giá hài lòng, hệ thống Vendora sẽ hoàn tất bảo chứng ký quỹ 15 ngày và gửi tặng bạn ngay <strong>Voucher 50.000 ₫</strong>.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Link
                href={`/orders/${orderId}`}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Để Sau
              </Link>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md shadow-indigo-100 transition flex items-center gap-2"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                Gửi Đánh Giá Hoàn Tất Escrow
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
