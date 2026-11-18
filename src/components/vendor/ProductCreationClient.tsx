"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Sparkles, UploadCloud, Layers, Plus, Trash2, 
  CheckCircle2, DollarSign, Package, ShieldCheck, Camera, Save, ArrowRight
} from "lucide-react";
import { createProductAction } from "@/app/actions/vendor";

interface ProductCreationClientProps {
  vendorId: string;
  categories: any[];
}

interface SkuVariant {
  id: string;
  code: string;
  material: string;
  switchType: string;
  price: string;
  stock: number;
}

export function ProductCreationClient({ vendorId, categories }: ProductCreationClientProps) {
  const router = useRouter();

  // Basic Info
  const [title, setTitle] = useState("Bàn Phím Cơ Gỗ Óc Chó FAS Artisan (Custom Edition)");
  const [slug, setSlug] = useState("ban-phim-co-go-oc-cho-fas-artisan-custom");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [description, setDescription] = useState(
    "Chế tác thủ công từ phôi gỗ óc chó Bắc Mỹ (FAS) tuyển chọn. Cấu trúc Gasket mount silicone êm ái, plate đồng thau phay CNC và switch đã được bôi trơn thủ công bằng mỡ Krytox 205g0."
  );
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"
  );

  // Specifications
  const [materialSpec, setMaterialSpec] = useState("Gỗ óc chó đen Bắc Mỹ FAS 100%");
  const [weightSpec, setWeightSpec] = useState("1.450g (Đầm tay)");
  const [connectionSpec, setConnectionSpec] = useState("Type-C Rời, Bluetooth 5.3, Wireless 2.4Ghz");

  // Dynamic SKU Matrix
  const [skus, setSkus] = useState<SkuVariant[]>([
    {
      id: "1",
      code: "KB-WALNUT-LUBED",
      material: "Gỗ Óc Chó Tự Nhiên",
      switchType: "Linear Lubed Krytox 205g0",
      price: "1850000",
      stock: 15,
    },
    {
      id: "2",
      code: "KB-WALNUT-STOCK",
      material: "Gỗ Óc Chó Tự Nhiên",
      switchType: "Tactile Stock Switch",
      price: "1650000",
      stock: 8,
    },
    {
      id: "3",
      code: "KB-OAK-LUBED",
      material: "Gỗ Sồi Trắng (White Oak)",
      switchType: "Linear Lubed Krytox 205g0",
      price: "1750000",
      stock: 10,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const formatVND = (amount: number | string) => {
    return new Intl.NumberFormat("vi-VN").format(Number(amount)) + " ₫";
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    );
  };

  const handleAddSkuRow = () => {
    const newId = (skus.length + 1).toString();
    setSkus([
      ...skus,
      {
        id: newId,
        code: `KB-VAR-${newId}`,
        material: "Gỗ Tuyển Chọn",
        switchType: "Custom Switch",
        price: "1850000",
        stock: 5,
      },
    ]);
  };

  const handleRemoveSkuRow = (id: string) => {
    if (skus.length > 1) {
      setSkus(skus.filter((s) => s.id !== id));
    }
  };

  const handleUpdateSku = (id: string, field: keyof SkuVariant, value: any) => {
    setSkus(
      skus.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const mappedSkus = skus.map((s) => ({
      skuCode: s.code,
      price: s.price,
      stock: Number(s.stock) || 0,
      attributes: {
        material: s.material,
        switchType: s.switchType,
      },
    }));

    const primarySku = mappedSkus[0];
    const res = await createProductAction({
      vendorId,
      categoryId: categoryId || categories[0]?.id,
      title,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      description,
      imageUrl,
      specs: {
        material: materialSpec,
        weight: weightSpec,
        connectivity: connectionSpec,
      },
      price: primarySku?.price || "0",
      skuCode: primarySku?.skuCode || `SKU-${Date.now()}`,
      initialStock: primarySku?.stock || 0,
      attributes: primarySku?.attributes,
      skus: mappedSkus,
    });

    setIsSubmitting(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/vendor/dashboard");
      }, 1500);
    } else {
      alert("Lỗi khi tạo sản phẩm: " + res.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-8 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/vendor/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition"
          >
            <ArrowLeft className="w-4 h-4" /> Quay Lại Studio Dashboard
          </Link>

          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-primary border border-indigo-100 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Maker Studio • Product Suite
          </span>
        </div>

        {success ? (
          <div className="bg-white rounded-3xl card-border p-12 text-center shadow-xl animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-6 text-emerald-500 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
              Xuất Bản Tác Phẩm Thành Công!
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
              Sản phẩm <strong>{title}</strong> đã được đồng bộ lên sàn Vendora và sẵn sàng nhận đơn đặt hàng từ người mua.
            </p>
            <div className="text-xs text-primary font-bold animate-pulse">
              Đang chuyển hướng về Vendor Dashboard...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Thêm Sản Phẩm Chế Tác Mới
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Thiết lập thông tin sản phẩm, câu chuyện xưởng và ma trận biến thể SKU để bán độc quyền trên Vendora.
              </p>
            </div>

            {/* Section 1: Basic Information */}
            <div className="bg-white rounded-3xl card-border p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Package className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  1. Thông Tin Cơ Bản
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Tên Sản Phẩm / Tác Phẩm *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="VD: Bàn Phím Cơ Gỗ Óc Chó Tự Nhiên 75%"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Đường Dẫn Slug (Tự Động)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={slug}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Danh Mục Chế Tác *
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Câu Chuyện Chế Tác &amp; Mô Tả Chi Tiết *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Kể về nguồn gốc chất liệu gỗ, kỹ thuật phay CNC, công đoạn lube switch thủ công..."
                    className="w-full p-4 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Media Gallery */}
            <div className="bg-white rounded-3xl card-border p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Camera className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  2. Hình Ảnh Studio Của Tác Phẩm
                </h3>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Đường dẫn ảnh bìa Studio (High-Res 1:1)
                </label>
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative flex-shrink-0">
                    <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Khuyến nghị ảnh độ phân giải tối thiểu 1200x1200px với ánh sáng studio tự nhiên.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Technical Specs */}
            <div className="bg-white rounded-3xl card-border p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  3. Thông Số Kỹ Thuật Độc Bản
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Chất Liệu Phôi</label>
                  <input
                    type="text"
                    value={materialSpec}
                    onChange={(e) => setMaterialSpec(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Trọng Lượng (g)</label>
                  <input
                    type="text"
                    value={weightSpec}
                    onChange={(e) => setWeightSpec(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Kết Nối</label>
                  <input
                    type="text"
                    value={connectionSpec}
                    onChange={(e) => setConnectionSpec(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Dynamic SKU Matrix Editor */}
            <div className="bg-white rounded-3xl card-border p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      4. Ma Trận Biến Thể SKU &amp; Tồn Kho Khả Dụng
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Mỗi dòng là một mã SKU độc lập với giá bán và số lượng phôi sẵn sàng đóng gói.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddSkuRow}
                  className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-primary text-xs font-bold transition flex items-center gap-1.5 border border-indigo-100"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm Biến Thể
                </button>
              </div>

              {/* SKU Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                      <th className="py-2.5 px-3">Mã SKU</th>
                      <th className="py-2.5 px-3">Phân Loại Gỗ</th>
                      <th className="py-2.5 px-3">Tùy Chọn Switch</th>
                      <th className="py-2.5 px-3">Giá Bán (VNĐ)</th>
                      <th className="py-2.5 px-3">Tồn Kho</th>
                      <th className="py-2.5 px-2 text-right">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {skus.map((sku) => (
                      <tr key={sku.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            value={sku.code}
                            onChange={(e) => handleUpdateSku(sku.id, "code", e.target.value)}
                            className="w-32 px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono text-[11px] font-bold text-slate-800"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            value={sku.material}
                            onChange={(e) => handleUpdateSku(sku.id, "material", e.target.value)}
                            className="w-36 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            value={sku.switchType}
                            onChange={(e) => handleUpdateSku(sku.id, "switchType", e.target.value)}
                            className="w-44 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            step="10000"
                            value={sku.price}
                            onChange={(e) => handleUpdateSku(sku.id, "price", e.target.value)}
                            className="w-28 px-2.5 py-1.5 rounded-lg border border-slate-200 font-bold text-xs text-primary"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            min="0"
                            value={sku.stock}
                            onChange={(e) => handleUpdateSku(sku.id, "stock", Number(e.target.value))}
                            className="w-16 px-2.5 py-1.5 rounded-lg border border-slate-200 font-bold text-xs text-slate-800 text-center"
                          />
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveSkuRow(sku.id)}
                            disabled={skus.length <= 1}
                            className="p-1.5 text-slate-300 hover:text-red-500 disabled:opacity-20 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between p-6 bg-white rounded-3xl card-border shadow-sm">
              <Link
                href="/vendor/dashboard"
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Hủy Bỏ
              </Link>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md shadow-indigo-100 transition flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "Đang Xuất Bản..." : "Xuất Bản Sản Phẩm Lên Gian Hàng"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
