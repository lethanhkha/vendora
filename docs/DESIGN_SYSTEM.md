# Vendora Sovereign – Design System & Màn Hình Hoàn Chỉnh Trên Google Stitch
> Được sinh và đồng bộ trực tiếp trên **Google Stitch** của bạn
> **Project ID:** `2437820855179381593`  
> **Link Dự án Trực tiếp:** [https://stitch.google.com/projects/2437820855179381593](https://stitch.google.com/projects/2437820855179381593)

---

## 1. Triết Lý Thiết Kế: "Clean Kinetic Commerce"

Giao diện **Vendora** được tạo trên canvas của Stitch thể hiện đầy đủ 3 trụ cột thiết kế:
1. **Shop-Centric Attribution:** Mỗi sản phẩm đều mang một **Vendor Attribution Bar** độc lập (Logo shop tròn, Tên shop, Huy hiệu *Verified / Flagship / Heritage*, vị trí Hà Nội / TP.HCM / Đà Lạt, cam kết giao hàng 24h).
2. **Multi-Store Bundle & Order Splitting Transparency:** Trực quan hóa việc phân tách đơn hàng rõ ràng từ giỏ hàng đến khâu thanh toán ký quỹ (Escrow 15 ngày).
3. **Typography & Tiền Tệ Bản Địa:** Phông chữ `Plus Jakarta Sans`, giá niêm yết chuẩn Việt Nam Đồng (`₫ 2.450.000` hoặc `1.850.000 ₫`).

---

## 2. Bảng Màu Chuẩn (Color Tokens)

| Token Name | Mã Màu Hex | Vị Trí Áp Dụng Trên Giao Diện Stitch |
| :--- | :--- | :--- |
| **`primary`** | `#4F46E5` (Electric Indigo) | Nút "Explore Featured Boutiques", Nút "Add to Cart", Nút Checkout |
| **`primary-hover`** | `#4338CA` | Trạng thái hover của các nút chính |
| **`secondary-seal`** | `#7C3AED` (Royal Violet) | Huy hiệu xác thực gian hàng (Verified Merchant, Heritage Boutique) |
| **`accent-amber`** | `#F59E0B` (Warm Amber) | Đánh giá sao, huy hiệu Flash Sale, cảnh báo tồn kho sắp hết |
| **`neutral-dark`** | `#0F172A` (Obsidian Slate) | Header, tiêu đề chính, giá tiền hiển thị đậm nét |
| **`neutral-muted`** | `#64748B` (Muted Slate) | Tên gian hàng phụ, xuất xứ, thời gian giao hàng dự kiến |
| **`canvas-bg`** | `#F8FAFC` (Slate 50) | Nền tổng thể trang web |
| **`surface-card`** | `#FFFFFF` | Nền các thẻ sản phẩm, thẻ gian hàng, thanh tìm kiếm |
| **`border-subtle`** | `#E2E8F0` (Slate 200) | Đường viền micro-border 1px sắc sảo giữa các khối |
| **`success-emerald`** | `#10B981` | Trạng thái gian hàng hoạt động (`ACTIVE`), cam kết Escrow 100% |

---

## 3. Tổng Hợp 4 Màn Hình Đã Hoàn Tất Trên Stitch Canvas

```
┌────────────────────────────────────────────────────────────────────────┐
│                        4 MÀN HÌNH HOÀN THIỆN VENDORA                   │
├────────────────────────────────────┬───────────────────────────────────┤
│ 1. MARKETPLACE STOREFRONT          │ 2. PRODUCT DETAIL PAGE (PDP)      │
│ - Header & ⌘K Search Bar           │ - Gallery ảnh lớn, Switch variant │
│ - Hero: Curated Boutiques          │ - Maker Profile: KeebCraft VN     │
│ - Multi-Vendor Product Grid (VND)  │ - Stock indicator & Escrow tabs   │
├────────────────────────────────────┼───────────────────────────────────┤
│ 3. MULTI-VENDOR CART & CHECKOUT    │ 4. VENDOR STUDIO DASHBOARD        │
│ - Giỏ hàng phân nhóm theo từng shop│ - Metric Cards (Revenue, Orders)  │
│ - Subtotal & Ship riêng từng shop  │ - Sub-orders Table riêng của Shop │
│ - Order Splitting Summary & COD    │ - Live Inventory Table (+/- edit) │
└────────────────────────────────────┴───────────────────────────────────┘
```

### Màn hình 1 — Vendora Marketplace Storefront (Trang chủ sàn)
* **Header:** Sticky Header với Logo Vendora PRO, ô tìm kiếm thông minh tích hợp phím tắt `⌘K` và dropdown chọn danh mục, giỏ hàng đếm số lượng live (`3 items • 1.850.000 ₫`).
* **Hero Banner:** *"Curated Independent Boutiques. One Unified Cart."* kèm thẻ preview gom đơn đa cửa hàng (`Multi-Store Bundle Preview`).
* **Category Chips:** Trending Today, Fashion & Apparel, Tech & Audio, Home & Ceramics, Clean Beauty.
* **Product Grid:** 8 sản phẩm thủ công / boutique chọn lọc có thanh **Vendor Attribution Bar** (Avatar, Tên shop *KeebCraft VN*, *Top Artisan Saigon*, *Gốm Bát Tràng Atelier*, huy hiệu tím Verified, giá tiền VNĐ).
* **Trust Footer:** 4 trụ cột an tâm (Ký quỹ Escrow 15 ngày, Giao trực tiếp từ xưởng, Thanh toán VietQR / MoMo / ZaloPay / NAPAS).

### Màn hình 2 — Product Detail Page (PDP - Trang chi tiết sản phẩm)
* **Gallery:** Thư viện ảnh chi tiết bàn phím cơ gỗ óc chó nguyên khối FAS Grade kèm dải 5 thumbnails.
* **Thông tin giá:** `1.850.000 ₫` (giá gốc `2.150.000 ₫`, giảm 14%), hỗ trợ thanh toán VietQR / MoMo.
* **Bộ chọn biến thể (SKU Selectors):** Switch type (*Linear Red*, *Tactile Brown*, *Clicky Blue*) và Layout (*ANSI 75%*, *ISO 75%*).
* **Cảnh báo tồn kho live:** *"Chỉ còn 4 sản phẩm trong đợt sản xuất #11 • Kho Ba Đình, Hà Nội"*.
* **Nút hành động:** *"Add to Unified Cart"* (Electric Indigo) và *"Buy Now with Vendora Escrow"*.
* **Thẻ xưởng Maker Profile:** Gian hàng *KeebCraft VN* (Đánh giá 4.96/5, 99.2% phản hồi tích cực, nút *Chat với xưởng* và *Ghé thăm gian hàng*).

### Màn hình 3 — Multi-Vendor Cart & Checkout (Giỏ hàng hợp nhất & Tách đơn)
* **Stepper quy trình:** `Cart & Bag` $\rightarrow$ `Multi-Vendor Shipping` $\rightarrow$ `Unified Escrow Payment`.
* **Cột trái (Phân cụm rõ ràng theo từng gian hàng):**
  * *Khối Shop KeebCraft VN (1 món):* Bàn phím cơ gỗ óc chó (`1.850.000 ₫`), stepper số lượng, phí ship xưởng (`30.000 ₫`), thanh tiến độ freeship, tổng gói shop: `1.880.000 ₫`.
  * *Khối Shop Aura Saigon Leather (1 món):* Desk mat da bò thủ công (`450.000 ₫`), stepper số lượng, phí ship xưởng (`25.000 ₫`), tổng gói shop: `475.000 ₫`.
* **Cột phải (Sticky Unified Order Summary):**
  * Tiền hàng: `2.300.000 ₫` + Phí vận chuyển: `55.000 ₫` - Voucher sàn: `50.000 ₫` = **Tổng thanh toán: 2.305.000 ₫**.
  * Phương thức thanh toán: Mock Sandbox (VietQR / MoMo) và COD.
  * Nút CTA: *"Place Order (Split to 2 Shops) • 2.305.000 ₫"*.
  * Thẻ minh bạch giải ngân: Hiển thị mã đơn phân tách tương ứng: `#VN-9421A` (KeebCraft VN) và `#VN-9421B` (Aura Saigon Leather).

### Màn hình 4 — Vendor Studio Dashboard (Bảng điều khiển cho Người bán)
* **Header xưởng:** Tên shop **KeebCraft VN**, logo shop, huy hiệu `Status: ACTIVE` màu xanh ngọc (emerald green).
* **Metric Cards:** Doanh thu hôm nay (`4.650.000 ₫`), 5 đơn cần gói, 2 cảnh báo tồn kho thấp, điểm xưởng 4.9.
* **Sub-Orders Table:** Danh sách đơn hàng gửi riêng cho KeebCraft VN với các cột: Order ID, Khách hàng, Sản phẩm, Số tiền, Trạng thái (Pending / Processing / Shipped), nút *"Print Shipping Label"*.
* **Live Inventory Quick-Edit Table:** Bảng SKU (`KCB-WN75-RED`), ảnh thumbnail, giá bán lẻ, nút tăng giảm tồn kho trực tiếp `[-] Tồn kho [+]` và nút CTA `+ Add New Product` màu Electric Indigo.
