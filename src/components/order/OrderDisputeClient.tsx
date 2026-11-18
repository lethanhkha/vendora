"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  AlertTriangle, ShieldAlert, ArrowLeft, Camera, 
  CheckCircle2, Clock, Landmark, Package, FileText, Phone
} from "lucide-react";
import { submitDisputeAction } from "@/app/actions/order-lifecycle";

interface OrderDisputeClientProps {
  orderId: string;
  vendorOrderId?: string;
  orderNumber?: string;
  subOrderNumber?: string;
  amount?: string;
}

export function OrderDisputeClient({
  orderId,
  vendorOrderId,
  orderNumber = "VND-9421",
  subOrderNumber = "VND-9421-A",
  amount = "1.850.000 ₫",
}: OrderDisputeClientProps) {
  const [issueType, setIssueType] = useState("DAMAGED_IN_TRANSIT");
  const [description, setDescription] = useState("");
  const [settlementPreference, setSettlementPreference] = useState<"REFUND_VIETQR" | "REPLACE_FREE">("REFUND_VIETQR");
  const [contactPhone, setContactPhone] = useState("0912 345 678");
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80"
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [disputeRecordNumber, setDisputeRecordNumber] = useState<string>("DSP-8821");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddProof = () => {
    if (uploadedPhotos.length < 5) {
      setUploadedPhotos((prev) => [
        ...prev,
        "https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=400&q=80",
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (vendorOrderId) {
      const res = await submitDisputeAction({
        masterOrderId: orderId,
        vendorOrderId,
        issueType,
        description: description || "Bưu kiện bị nứt vỡ hư hỏng trong quá trình vận chuyển.",
        desiredResolution: settlementPreference,
        photos: uploadedPhotos,
      });

      if (res.success && res.dispute) {
        setDisputeRecordNumber(res.dispute.disputeNumber);
      }
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50/70 py-16 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl card-border p-8 sm:p-10 shadow-xl text-center animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-6 text-amber-600 shadow-inner">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
            Hồ Sơ Khiếu Nại #DSP-8821
          </span>

          <h2 className="text-2xl font-extrabold text-slate-900 mt-3 mb-2">
            Đã Tiếp Nhận Khiếu Nại Bảo Hộ Escrow!
          </h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Khoản thanh toán <strong>{amount}</strong> của kiện hàng <strong>{subOrderNumber}</strong> đã được phong tỏa trong Quỹ Ký Quỹ Vendora. Hội đồng trọng tài sẽ làm việc với xưởng <strong>KeebCraft VN</strong> và giải quyết trong vòng 24h làm việc.
          </p>

          <div className="bg-slate-50 rounded-2xl p-4 mb-8 text-left border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Mã khiếu nại:</span>
              <span className="font-mono font-bold text-slate-800">DSP-8821-VND</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Phương án mong muốn:</span>
              <span className="font-bold text-primary">
                {settlementPreference === "REFUND_VIETQR" ? "Hoàn tiền 100% qua VietQR" : "Đổi sản phẩm mới miễn phí ship"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Trạng thái bảo chứng:</span>
              <span className="text-amber-600 font-bold">Tạm khóa giải ngân (Frozen)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/orders/${orderId}`}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold transition text-center"
            >
              Về Chi Tiết Đơn Hàng
            </Link>
            <Link
              href="/account/orders"
              className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-md shadow-indigo-100 transition text-center"
            >
              Danh Sách Đơn Mua
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

        {/* Escrow Protection Status Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-6 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-black/20 px-2.5 py-0.5 rounded-full inline-block mb-1">
                Bảo Hộ Ký Quỹ 15 Ngày (Vendora Escrow Vault)
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold leading-snug">
                Quyền Lợi Của Bạn Được Bảo Vệ 100%
              </h2>
              <p className="text-xs text-amber-100 mt-1 leading-relaxed">
                Quỹ ký quỹ Vendora đang tạm giữ số tiền <strong>{amount}</strong> của đơn kiện này. Xưởng sẽ không thể rút tiền cho đến khi khiếu nại của bạn được giải quyết thỏa đáng.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl card-border p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="border-b border-slate-100 pb-5 mb-6">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Yêu Cầu Khiếu Nại &amp; Hoàn Tiền Ký Quỹ
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Đơn hàng: <strong className="text-slate-800">#{orderNumber}</strong> • Kiện xưởng: <strong className="text-slate-800">{subOrderNumber}</strong>
            </p>
          </div>

          {/* Sub-Order Package Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 relative flex-shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=200&q=80"
                  alt="Item"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  Bàn Phím Cơ Gỗ Óc Chó FAS 75%
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Xưởng KeebCraft VN • Vận đơn: GHTK-KCB-9921</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-extrabold text-slate-900">{amount}</p>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                Đã Thanh Toán
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Issue Type Dropdown */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                1. Lý do bạn muốn khiếu nại? *
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white cursor-pointer"
              >
                <option value="DAMAGED_IN_TRANSIT">Sản phẩm bị nứt/vỡ/trầy xước do quá trình vận chuyển</option>
                <option value="NOT_AS_DESCRIBED">Sản phẩm không đúng mô tả gỗ óc chó FAS tự nhiên</option>
                <option value="MISSING_PARTS">Thiếu phụ kiện cáp mạ vàng/keycap puller kèm theo</option>
                <option value="MALFUNCTION">Lỗi switch gõ hoặc chập mạch PCB không nhận tín hiệu</option>
                <option value="OTHER">Lý do khác</option>
              </select>
            </div>

            {/* Photographic Proof Upload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700">
                  2. Bằng chứng hình ảnh/video hộp đóng gói và vị trí lỗi *
                </label>
                <span className="text-[11px] text-slate-400 font-semibold">{uploadedPhotos.length}/5 ảnh</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {uploadedPhotos.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                    <Image src={url} alt={`Evidence ${idx}`} fill className="object-cover" />
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
                    onClick={handleAddProof}
                    className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-amber-500 flex flex-col items-center justify-center text-slate-400 hover:text-amber-600 transition bg-slate-50/50"
                  >
                    <Camera className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold">Thêm ảnh</span>
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Chụp rõ tem vận đơn, hộp bên ngoài và chi tiết khuyết tật của sản phẩm.
              </p>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                3. Mô tả chi tiết tình trạng sự cố *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Vui lòng mô tả rõ khi bạn mở hộp có hiện tượng gì, góc bàn phím bị nứt ở đâu hoặc linh kiện nào bị thiếu..."
                className="w-full p-3.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 resize-none leading-relaxed"
              />
            </div>

            {/* Desired Settlement Radio Group */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2.5">
                4. Phương án giải quyết bạn mong muốn:
              </label>
              <div className="space-y-3">
                <label
                  onClick={() => setSettlementPreference("REFUND_VIETQR")}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                    settlementPreference === "REFUND_VIETQR"
                      ? "border-primary bg-indigo-50/50 ring-2 ring-primary/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="settlement"
                    checked={settlementPreference === "REFUND_VIETQR"}
                    onChange={() => setSettlementPreference("REFUND_VIETQR")}
                    className="mt-1 text-primary accent-primary"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Hoàn tiền 100% vào tài khoản ngân hàng VietQR ({amount})
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Sau khi thẩm định, tiền sẽ được hoàn trả tự động vào tài khoản đã thanh toán trong vòng 2h.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setSettlementPreference("REPLACE_FREE")}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                    settlementPreference === "REPLACE_FREE"
                      ? "border-primary bg-indigo-50/50 ring-2 ring-primary/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="settlement"
                    checked={settlementPreference === "REPLACE_FREE"}
                    onChange={() => setSettlementPreference("REPLACE_FREE")}
                    className="mt-1 text-primary accent-primary"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Đổi mới sản phẩm khác từ xưởng (Miễn phí 100% phí ship 2 chiều)
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Xưởng KeebCraft VN sẽ đóng gói sản phẩm mới và gửi shipper đến đổi tận nhà cho bạn.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Phone Confirmation */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                5. Số điện thoại để Ban Trọng Tài liên hệ đối soát:
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <Link
                href={`/orders/${orderId}`}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition"
              >
                Hủy Bỏ
              </Link>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-100 transition flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-white" />
                Gửi Khiếu Nại Lên Hội Đồng Trọng Tài Vendora
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
