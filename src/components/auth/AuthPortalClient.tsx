"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sparkles, ShieldCheck, User, Store, Lock, Mail, 
  ArrowRight, AlertCircle, MapPin
} from "lucide-react";
import { loginAction, signupAction } from "@/app/actions/auth";

export function AuthPortalClient() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [role, setRole] = useState<"BUYER" | "VENDOR">("BUYER");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [shopName, setShopName] = useState<string>("");
  const [location, setLocation] = useState<string>("Hà Nội");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      if (isLogin) {
        const res = await loginAction({ email, password });
        if (!res.success) {
          setErrorMessage(res.error || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
          setLoading(false);
          return;
        }

        if (res.role === "ADMIN") {
          router.push("/admin");
        } else if (res.role === "VENDOR") {
          router.push("/vendor/dashboard");
        } else {
          router.push("/account/orders");
        }
      } else {
        const res = await signupAction({
          email,
          password,
          fullName,
          role,
          shopName: role === "VENDOR" ? shopName : undefined,
          location: role === "VENDOR" ? location : undefined,
        });

        if (!res.success) {
          setErrorMessage(res.error || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
          setLoading(false);
          return;
        }

        if (res.role === "VENDOR") {
          router.push("/vendor/dashboard");
        } else {
          router.push("/account/orders");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-12 px-4 sm:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Vendora
            </span>
          </Link>
          <h2 className="text-xl font-extrabold text-slate-900">
            {isLogin ? "Đăng Nhập Vào Hệ Thống" : "Tạo Tài Khoản Mới"}
          </h2>
          <p className="text-xs text-slate-500">
            Sàn thương mại điện tử đa gian hàng bảo chứng ký quỹ 15 ngày
          </p>
        </div>

        {/* Role Selector (visible during Registration or Sign In) */}
        {!isLogin && (
          <div className="bg-white rounded-3xl card-border p-2 shadow-sm grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setRole("BUYER")}
              className={`py-3 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                role === "BUYER"
                  ? "bg-primary text-white shadow-md shadow-indigo-100"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Khách Mua Hàng</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("VENDOR")}
              className={`py-3 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                role === "VENDOR"
                  ? "bg-primary text-white shadow-md shadow-indigo-100"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Chủ Xưởng (Maker)</span>
            </button>
          </div>
        )}

        {/* Main Form Box */}
        <div className="bg-white rounded-3xl card-border p-6 sm:p-8 shadow-sm space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Họ và tên *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900"
                  />
                </div>
              </div>
            )}

            {!isLogin && role === "VENDOR" && (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Tên Xưởng / Gian Hàng *</label>
                  <div className="relative">
                    <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: KeebCraft VN"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Địa chỉ / Tỉnh Thành *</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Hà Nội, TP.HCM, Đà Nẵng..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Email tài khoản *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Mật khẩu *</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Tối thiểu 6 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md shadow-indigo-100 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <span>{loading ? "Đang xử lý..." : isLogin ? "Đăng Nhập" : "Đăng Ký Tài Khoản"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMessage(null);
              }}
              className="text-xs text-slate-600 hover:text-primary transition font-medium"
            >
              {isLogin ? (
                <>
                  Chưa có tài khoản? <strong className="text-primary font-bold">Đăng ký ngay</strong>
                </>
              ) : (
                <>
                  Đã có tài khoản? <strong className="text-primary font-bold">Đăng nhập tại đây</strong>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Escrow Guarantee Pill */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Bảo mật 2 lớp • Bảo hộ ký quỹ Escrow 15 ngày</span>
        </div>
      </div>
    </div>
  );
}
