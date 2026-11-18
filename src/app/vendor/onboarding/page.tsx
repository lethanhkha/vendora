"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Store,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  CreditCard,
  MapPin,
  Eye,
  Check
} from "lucide-react";
import { onboardVendorAction } from "@/app/actions/onboard";

export default function VendorOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [shopName, setShopName] = useState("KeebCraft VN");
  const [slug, setSlug] = useState("keebcraft-vn");
  const [category, setCategory] = useState("Công nghệ & Bàn phím cơ");
  const [location, setLocation] = useState("Ba Đình, Hà Nội");
  const [description, setDescription] = useState("Xưởng thủ công chuyên tiện CNC vỏ gỗ óc chó và tinh chỉnh switch bàn phím cơ độc bản tại Hà Nội.");
  const [bankName, setBankName] = useState("Techcombank");
  const [accountNumber, setAccountNumber] = useState("1903 8888 6666 99");
  const [accountName, setAccountName] = useState("NGUYEN MINH KHOI");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (name: string) => {
    setShopName(name);
    setSlug(
      name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const res = await onboardVendorAction({
      shopName,
      slug,
      description,
      location,
    });

    if (res.success) {
      router.push("/vendor/dashboard");
    } else {
      setError(res.error || "Không thể tạo gian hàng");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      {/* Top Stepper Bar */}
      <div className="p-6 rounded-3xl bg-white card-border shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-vendor-seal tracking-wider">
            SELLER ONBOARDING PORTAL
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-dark mt-1">
            Mở Gian Hàng Độc Lập • Kích Hoạt Tức Thì (Instant Active)
          </h1>
        </div>

        {/* 3 Steps Indicator */}
        <div className="flex items-center gap-3 text-xs font-bold">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${step >= 1 ? "bg-primary text-white" : "bg-slate-100 text-slate-400"}`}>
            <span>1</span>
            <span className="hidden sm:inline">Hồ Sơ Shop</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${step >= 2 ? "bg-primary text-white" : "bg-slate-100 text-slate-400"}`}>
            <span>2</span>
            <span className="hidden sm:inline">Vị Trí & Ngành</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${step === 3 ? "bg-primary text-white" : "bg-slate-100 text-slate-400"}`}>
            <span>3</span>
            <span className="hidden sm:inline">Nhận Tiền VietQR</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Column (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl card-border p-6 sm:p-8 shadow-soft space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* Step 1 Fields */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="pb-3 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-dark">Bước 1: Nhận Diện Gian Hàng</h2>
                  <p className="text-[11px] text-slate-400">Tên thương hiệu và đường dẫn gian hàng độc lập của bạn</p>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tên Gian Hàng / Xưởng Chế Tác *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: KeebCraft VN"
                    value={shopName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl card-border bg-slate-50 text-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Đường Dẫn Gian Hàng (Store Slug) *</label>
                  <div className="flex items-center card-border rounded-xl bg-slate-50 overflow-hidden text-xs">
                    <span className="px-3 text-slate-400 font-mono">vendora.vn/store/</span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="flex-1 py-2.5 pr-3 bg-transparent text-dark font-mono font-semibold focus:outline-none"
                    />
                    <span className="px-2.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 py-1 mr-2 rounded">
                      Khả dụng ✓
                    </span>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mô Tả Xưởng Chế Tác & Tôn Chỉ Nghề *</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Giới thiệu về kinh nghiệm, chất liệu tự nhiên, phương pháp thủ công..."
                    className="w-full px-3.5 py-2.5 rounded-xl card-border bg-slate-50 text-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3 rounded-xl bg-dark text-white font-bold text-xs hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
                >
                  <span>Tiếp Tục: Vị Trí & Ngành Hàng</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Step 2 Fields */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="pb-3 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-dark">Bước 2: Địa Điểm Xưởng & Ngành Hàng</h2>
                  <p className="text-[11px] text-slate-400">Nơi xuất phát bưu kiện khi giao cho đơn vị vận chuyển</p>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ngành Hàng Chuyên Biệt *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl card-border bg-slate-50 text-dark focus:bg-white focus:outline-none text-xs font-semibold"
                  >
                    <option value="Công nghệ & Bàn phím cơ">Công nghệ & Bàn phím cơ (Artisan Tech)</option>
                    <option value="Đồ da & Thủ công may tay">Đồ da & Thủ công may tay (Leather Craft)</option>
                    <option value="Gốm sứ men hỏa biến">Gốm sứ men hỏa biến & Trang trí (Ceramics)</option>
                    <option value="Thời trang độc bản">Thời trang thiết kế (Boutique Fashion)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Địa Điểm Xưởng / Kho Hàng *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ví dụ: Ba Đình, Hà Nội"
                    className="w-full px-3.5 py-2.5 rounded-xl card-border bg-slate-50 text-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
                  >
                    Quay Lại
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 rounded-xl bg-dark text-white font-bold text-xs hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
                  >
                    <span>Tiếp Tục: Tài Khoản Payout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 Fields */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="pb-3 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-dark">Bước 3: Tài Khoản Nhận Thanh Toán (VietQR Payout)</h2>
                  <p className="text-[11px] text-slate-400">Tự động đối soát và giải ngân sau 15 ngày Escrow an toàn</p>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ngân Hàng Thụ Hưởng</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl card-border bg-slate-50 text-dark focus:bg-white focus:outline-none text-xs font-semibold"
                  >
                    <option value="Techcombank">Techcombank (Ngân hàng TMCP Kỹ Thương)</option>
                    <option value="Vietcombank">Vietcombank (Ngân hàng TMCP Ngoại Thương)</option>
                    <option value="MBBank">MBBank (Ngân hàng Quân Đội)</option>
                    <option value="ACB">ACB (Ngân hàng Á Châu)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Số Tài Khoản</label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl card-border bg-slate-50 text-dark font-mono text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tên Chủ Tài Khoản (Không dấu)</label>
                  <input
                    type="text"
                    required
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl card-border bg-slate-50 text-dark font-mono text-sm font-bold uppercase"
                  />
                </div>

                {/* Auto-Activation Guarantee Highlight Box */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Cam Kết Kích Hoạt Tức Thì (Instant Active Guarantee)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Gian hàng của bạn được cấp trạng thái <code className="bg-white px-1 py-0.5 rounded font-mono font-bold text-emerald-700">status: 'ACTIVE'</code> ngay khi nhấn nút bên dưới. Bạn có thể đăng sản phẩm, nhận đơn và quản trị kho hàng tức thì.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
                  >
                    Quay Lại
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow transition-all active:scale-98 flex items-center justify-center gap-2 disabled:bg-slate-300"
                  >
                    <span>{isSubmitting ? "Đang kích hoạt gian hàng..." : "Hoàn Tất Đăng Ký & Vào Vendor Studio"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Right Live Preview Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-primary" />
              <span>Xem Trước Thời Gian Thực (Live Preview)</span>
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
              Desktop View
            </span>
          </div>

          {/* Simulated Storefront Card on Vendora */}
          <div className="p-6 rounded-3xl bg-white card-border shadow-soft space-y-4">
            <div className="h-28 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden p-4 flex items-end">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:12px_12px]" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-lg relative overflow-hidden flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80"
                    alt="Logo"
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
                <div className="text-white min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-extrabold text-sm truncate">{shopName || "Tên Gian Hàng"}</p>
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-300" />
                  </div>
                  <span className="text-[10px] text-emerald-300 font-bold">Status: ACTIVE</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Đường dẫn gian hàng:</span>
                <span className="font-mono text-primary font-bold">/store/{slug || "slug"}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Vị trí kho xưởng:</span>
                <span className="font-semibold text-dark">{location || "Chưa nhập"}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Ngành hàng:</span>
                <span className="font-semibold text-dark">{category}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                "{description || "Mô tả xưởng chế tác thủ công..."}"
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Huy hiệu Verified Merchant
              </span>
              <span>Đánh giá khởi đầu: 5.0 ★</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
