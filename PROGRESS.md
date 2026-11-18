# 📋 Bảng Theo Dõi Tiến Trình Dự Án Vendora (PROGRESS.md)
> **Kiến trúc:** Multi-Vendor E-Commerce Modular Monolith  
> **Ngăn xếp:** Next.js 15 (App Router) • TypeScript • Drizzle ORM • PostgreSQL (Supabase) • Tailwind CSS  
> **Cập nhật lần cuối:** 18/11/2026  

---

## 📊 Tổng Quan Tiến Độ Theo Giai Đoạn (Workflow Overview)

```
┌────────────────────────────────────────────────────────────────────────┐
│                      QUY TRÌNH PHÁT TRIỂN VENDORA                      │
├────────────────────────────────────────────────────────────────────────┤
│ [x] Giai đoạn 1: Đặc tả Yêu cầu & Kiến trúc (PRD)            100%     │
│ [x] Giai đoạn 2: Thiết kế Giao diện & Design System (Stitch)  100%     │
│ [x] Giai đoạn 3: CSDL & Hạ tầng Dữ liệu (Drizzle & Supabase) 100%     │
│ [x] Giai đoạn 4: Frontend - Core Screens & Component UI       95%      │
│ [x] Giai đoạn 5: Backend - Modular Domain & Server Actions    95%      │
│ [x] Giai đoạn 6: Kiểm thử Tích hợp & Concurrency (E2E)        100%     │
│ [x] Giai đoạn 7: Hoàn thiện Tính năng Giai đoạn 2 (Should-Have) 100%   │
│ [ ] Giai đoạn 8: Đóng gói Docker & Vận hành Staging/Prod       0%      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ CHI TIẾT TỪNG GIAI ĐOẠN & CÁC NHIỆM VỤ NHỎ

### Giai đoạn 1: Đặc tả Yêu cầu & Kiến trúc Nghiệp vụ (Requirements & Architecture)
- [x] **Task 1.1: Khảo sát & Biên soạn PRD (Product Requirements Document)**
  - File: `docs/PRD.md`
  - Chi tiết:
    - [x] Định nghĩa vấn đề cốt lõi & bài toán Multi-Vendor Marketplace (Pain points của Buyer, Vendor, Platform).
    - [x] Thiết lập mục tiêu kinh doanh & chỉ số đo lường (Checkout completion $\ge 70\%$, Onboarding $\le 5$m, $0\%$ Overselling, P95 $\le 200$ms).
    - [x] Xây dựng chân dung 3 nhóm người dùng (Buyer "Minh Anh", Vendor "Hoàng Long", Admin "Thu Hà").
    - [x] Phân loại tính năng theo khung MoSCoW (Must-Have, Should-Have, Could-Have, Won't-Have).
    - [x] Viết BDD User Stories kèm kịch bản chấp nhận cho từng module (`AUTH-01`, `CAT-01`, `CAT-02`, `CART-01`, `ORD-01`, `INV-01`, `BILL-01`).
    - [x] Chiến lược phòng ngừa 4 phản mẫu: Concurrency Race Condition, Cross-Shop Leakage, Premature Microservices, Monolithic Order Fallacy.
- [x] **Task 1.2: Thiết kế Kiến trúc Modular Monolith & Sơ đồ Tương tác Sự kiện**
  - File: `docs/PRD.md` (Mục 4)
  - Chi tiết:
    - [x] Sơ đồ phân chia 5 Bounded Contexts: Auth, Catalog, Cart/Order, Inventory, Billing.
    - [x] Thiết kế luồng phân tách đơn hàng (Order Splitting Flow: MasterOrder $\rightarrow$ N VendorOrders).
    - [x] Thiết kế mô hình Transactional Outbox & In-process Event Bus để đảm bảo tính toàn vẹn dữ liệu trừ kho.

---

### Giai đoạn 2: Thiết kế Giao diện & Hệ thống Thiết kế (Design System & UI/UX)
- [x] **Task 2.1: Xây dựng Triết lý Thiết kế "Clean Kinetic Commerce" & Bộ Tokens**
  - File: `docs/DESIGN_SYSTEM.md`, `tailwind.config.ts`, `src/app/globals.css`
  - Chi tiết:
    - [x] Định nghĩa bảng mã màu chuẩn: Electric Indigo (`#4F46E5`), Royal Violet (`#7C3AED`), Warm Amber (`#F59E0B`), Obsidian Slate (`#0F172A`), Emerald Green (`#10B981`).
    - [x] Cấu hình Typography phông chữ `Plus Jakarta Sans` và định dạng tiền tệ bản địa chuẩn Việt Nam Đồng (`₫`).
    - [x] Chuẩn hóa quy tắc Vendor Attribution Bar (Avatar, Tên shop, Huy hiệu Verified/Heritage, vị trí kho hàng).
- [x] **Task 2.2: Thiết kế 4 Màn hình Cốt lõi trên Google Stitch Canvas**
  - Dự án Stitch ID: `2437820855179381593`
  - Chi tiết:
    - [x] Màn hình 1: **Marketplace Storefront** (Header sticky, ⌘K search, Curated Boutiques Hero, Multi-vendor product grid, Trust footer).
    - [x] Màn hình 2: **Product Detail Page (PDP)** (Thư viện ảnh lớn, bộ chọn biến thể SKU đa chiều, cảnh báo tồn kho live, Maker Profile).
    - [x] Màn hình 3: **Multi-Vendor Cart & Checkout** (Stepper 3 bước, giỏ hàng phân cụm từng shop, minh bạch phí ship từng xưởng, ký quỹ Escrow 15 ngày).
    - [x] Màn hình 4: **Vendor Studio Dashboard** (Metric cards, danh sách Sub-orders riêng biệt, bảng Quick-edit tồn kho trực tiếp theo SKU).

---

### Giai đoạn 3: Cơ sở Dữ liệu & Hạ tầng Dữ liệu (Database & Infrastructure)
- [x] **Task 3.1: Định nghĩa Lược đồ Quan hệ CSDL với Drizzle ORM**
  - File: `src/shared/db/schema.ts`, `drizzle.config.ts`
  - Chi tiết:
    - [x] Enums: `user_role` (`BUYER`, `VENDOR`, `ADMIN`), `vendor_status`, `order_status`, `payment_status`, `outbox_status`.
    - [x] Bảng `users`: Quản lý tài khoản, email duy nhất, phân quyền RBAC.
    - [x] Bảng `vendors`: Quản lý gian hàng, `user_id`, slug, badge, location, rating.
    - [x] Bảng `categories`: Danh mục sản phẩm đa cấp, quan hệ cha-con (`parent_id`).
    - [x] Bảng `products` & `product_skus`: Sản phẩm đa biến thể, liên kết ngoại khóa `vendor_id` và `category_id`.
    - [x] Bảng `inventory_items`: Quản lý `available_stock`, `reserved_stock`, cột `version` phục vụ khóa lạc quan (Optimistic Locking).
    - [x] Bảng `master_orders` & `vendor_orders` & `order_items`: Kiến trúc tách đơn 3 tầng phân cấp.
    - [x] Bảng `outbox_events`: Lưu trữ sự kiện nghiệp vụ hướng sự kiện (Transactional Outbox).
    - [x] Bảng `reviews`: Đánh giá 1-5 sao, điểm nghệ nhân `craft_rating`, hình ảnh thực tế.
    - [x] Bảng `disputes`: Khiếu nại đơn hàng ký quỹ (Escrow Dispute), tình trạng giải quyết hoàn tiền/từ chối.
    - [x] Bảng `vouchers`: Mã giảm giá toàn sàn và mã giảm giá riêng theo từng shop.
    - [x] Thiết lập quan hệ `relations()` giữa các thực thể đảm bảo eager loading type-safe.
- [x] **Task 3.2: Kết nối Client Drizzle & Cấu hình Supabase**
  - File: `src/shared/db/index.ts`, `src/shared/supabase/admin.ts`, `src/shared/supabase/client.ts`, `src/shared/supabase/server.ts`
  - Chi tiết:
    - [x] Khởi tạo Postgres connection pool qua driver `postgres`.
    - [x] Tạo helper Supabase Client cho cả Server Components, Server Actions và Client Components.
- [x] **Task 3.3: Dữ liệu Khởi tạo (Database Seeding)**
  - File: `scripts/seed.ts`
  - Chi tiết:
    - [x] Tạo tài khoản mẫu: Buyer (`buyer@vendora.vn`), Vendor 1 (`vendor1@vendora.vn`), Vendor 2 (`vendor2@vendora.vn`), Admin (`admin@vendora.vn`).
    - [x] Tạo 2 gian hàng mẫu uy tín: `KeebCraft VN` (Bàn phím cơ & phụ kiện) và `Aura Saigon Leather` (Đồ da thủ công).
    - [x] Khởi tạo cây danh mục: Công nghệ & Âm thanh, Thời trang & Da thủ công, Gốm sứ & Mỹ nghệ.
    - [x] Khởi tạo các sản phẩm mẫu có đầy đủ biến thể SKU và số lượng tồn kho thực tế.
    - [x] Tạo mã giảm giá mẫu `KEEB50K` giảm 50.000 ₫ cho đơn từ 500.000 ₫.

---

### Giai đoạn 4: Lập trình Giao diện Người Dùng (Frontend Implementation)
- [x] **Task 4.1: App Shell & Thành phần Layout Chung**
  - File: `src/app/layout.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/cart/CartContext.tsx`
  - Chi tiết:
    - [x] Header điều hướng hỗ trợ tìm kiếm nhanh, hiển thị badge giỏ hàng thời gian thực, menu tài khoản.
    - [x] Footer thể hiện 4 cam kết tin cậy (Ký quỹ Escrow, giao tận xưởng, thanh toán nội địa, đổi trả 15 ngày).
    - [x] React Context `CartContext` quản lý giỏ hàng cục bộ (Local Storage sync, thêm/sửa/xóa, gom nhóm theo shop).
- [x] **Task 4.2: Trang chủ Sàn Thương Mại (Marketplace Storefront)**
  - File: `src/app/page.tsx`, `src/components/catalog/ProductCard.tsx`
  - Chi tiết:
    - [x] Hero section với thông điệp *"Curated Independent Boutiques"*.
    - [x] Thẻ xem trước giỏ hàng đa cửa hàng (Multi-Store Bundle Preview).
    - [x] Lưới sản phẩm (Product Grid) hiển thị thẻ `ProductCard` với đầy đủ Vendor Attribution Bar.
- [x] **Task 4.3: Trang Chi Tiết Sản Phẩm (Product Detail Page - PDP)**
  - File: `src/app/products/[slug]/page.tsx`, `src/components/catalog/ProductDetailClient.tsx`
  - Chi tiết:
    - [x] Gallery ảnh sản phẩm kèm thumbnails chọn góc nhìn.
    - [x] Bộ chọn thuộc tính biến thể SKU tương tác trực tiếp (Switch Type, Layout, Màu sắc).
    - [x] Cập nhật giá bán và cảnh báo tồn kho theo SKU được chọn.
    - [x] Maker Profile Card giới thiệu xưởng chế tác kèm nút liên hệ và đánh giá sao.
    - [x] Nút Thêm vào giỏ hàng thống nhất ("Add to Unified Cart") & Mua ngay với ký quỹ Escrow.
- [x] **Task 4.4: Trang Giỏ Hàng Hợp Nhất & Tách Đơn Thanh Toán (Cart & Checkout)**
  - File: `src/app/cart/page.tsx`
  - Chi tiết:
    - [x] Hiển thị giỏ hàng tự động phân cụm theo từng Vendor.
    - [x] Tính toán tạm tính và phí vận chuyển riêng biệt cho từng gian hàng.
    - [x] Nhập mã giảm giá Voucher toàn sàn / shop kèm kiểm tra điều kiện áp dụng.
    - [x] Cột tóm tắt đơn hàng tổng (Unified Order Summary) kèm thông báo tách đơn minh bạch.
    - [x] Form thông tin người nhận hàng và lựa chọn phương thức thanh toán (COD / Sandbox VietQR, MoMo).
- [x] **Task 4.5: Bảng Điều Khiển Gian Hàng (Vendor Studio Dashboard)**
  - File: `src/app/vendor/dashboard/page.tsx`, `src/components/vendor/VendorDashboardClient.tsx`
  - Chi tiết:
    - [x] Các thẻ thống kê doanh thu hôm nay, số đơn cần xử lý, cảnh báo tồn kho thấp.
    - [x] Danh sách đơn hàng con (Sub-orders) được lọc riêng cho shop hiện tại.
    - [x] Bảng quản lý tồn kho nhanh (Quick-edit stock) với các nút tăng/giảm trực tiếp.
- [x] **Task 4.6: Quản Lý Sản Phẩm & Đơn Hàng Phía Vendor**
  - File: `src/app/vendor/products/new/page.tsx`, `src/components/vendor/ProductCreationClient.tsx`, `src/app/vendor/orders/[id]/page.tsx`, `src/components/vendor/VendorOrderDetailClient.tsx`
  - Chi tiết:
    - [x] Form tạo sản phẩm mới hỗ trợ thêm nhiều biến thể SKU trong một lần nhập.
    - [x] Trang chi tiết đơn hàng cho Vendor: cập nhật trạng thái đơn (`PENDING` $\rightarrow$ `PROCESSING` $\rightarrow$ `SHIPPED` $\rightarrow$ `DELIVERED`).
- [x] **Task 4.7: Quản Lý Gian Hàng & Quyết Toán Ký Quỹ (Vendor Payouts & Escrow Ledger)**
  - File: `src/app/vendor/payouts/page.tsx`, `src/components/vendor/VendorPayoutsClient.tsx`, `src/app/vendor/onboarding/page.tsx`
  - Chi tiết:
    - [x] Bảng theo dõi số dư ký quỹ đang giữ (Escrow Holding), số dư khả dụng và lịch sử đối soát.
    - [x] Luồng đăng ký mở gian hàng mới (`/vendor/onboarding`) cho tài khoản Buyer muốn trở thành Vendor.
- [x] **Task 4.8: Cổng Xác Thực & Quản Lý Tài Khoản Khách Hàng (Auth & Buyer Account)**
  - File: `src/app/login/page.tsx`, `src/components/auth/AuthPortalClient.tsx`, `src/app/account/page.tsx`, `src/app/account/orders/page.tsx`, `src/components/account/BuyerAccountClient.tsx`
  - Chi tiết:
    - [x] Giao diện đăng nhập / đăng ký chuyển đổi mượt mà giữa các vai trò Buyer/Vendor.
    - [x] Trang quản lý thông tin cá nhân và lịch sử đơn hàng của người mua.
- [x] **Task 4.9: Theo Dõi Đơn Hàng, Đánh Giá & Khiếu Nại (Order Lifecycle UI)**
  - File: `src/app/orders/[id]/page.tsx`, `src/app/orders/[id]/dispute/page.tsx`, `src/app/orders/[id]/review/page.tsx`, `src/components/order/*`
  - Chi tiết:
    - [x] Trang hiển thị biên lai đơn hàng tổng và các đơn con kèm mã theo dõi kiện hàng.
    - [x] Giao diện gửi khiếu nại đơn hàng (Dispute Form) khi hàng hóa bị lỗi/hỏng trong vận chuyển.
    - [x] Giao diện đánh giá sản phẩm & điểm nghệ nhân xưởng để kích hoạt giải ngân ký quỹ sớm.
- [x] **Task 4.10: Tìm Kiếm, Bộ Lọc & Gian Hàng Riêng (Search & Boutique Storefront)**
  - File: `src/app/search/page.tsx`, `src/components/search/SearchCatalogClient.tsx`, `src/app/store/[slug]/page.tsx`, `src/components/vendor/BoutiqueStorefrontClient.tsx`
  - Chi tiết:
    - [x] Bộ lọc sản phẩm theo từ khóa, danh mục, khoảng giá và phân loại xưởng.
    - [x] Trang hồ sơ gian hàng độc lập (`/store/[slug]`) giới thiệu câu chuyện thương hiệu và danh mục riêng của shop.
- [x] **Task 4.11: Trang Quản Trị Sàn Toàn Diện (Platform Admin Portal)**
  - File: `src/app/admin/page.tsx`, `src/components/admin/AdminDashboardClient.tsx`
  - Chi tiết:
    - [x] Giám sát GMV toàn sàn, tổng số gian hàng hoạt động, tổng đơn phát sinh.
    - [x] Trọng tài khiếu nại (Dispute Resolution): Quyết định Hoàn tiền cho Khách (Refund) hoặc Chấp nhận cho Vendor.

---

### Giai đoạn 5: Lập trình Phân hệ Backend & Nghiệp vụ (Backend & Domain Services)
- [x] **Task 5.1: Phân hệ Quản trị Sự kiện & Outbox (Shared Event Bus)**
  - File: `src/shared/events/event-bus.ts`, `src/shared/events/outbox-processor.ts`
  - Chi tiết:
    - [x] Bộ điều phối sự kiện trong bộ nhớ (`InProcessEventBus`) phát tán domain events bất đồng bộ.
    - [x] Cơ chế ghi nhận và quét bảng `outbox_events` tự động chuyển trạng thái `PROCESSED`.
- [x] **Task 5.2: Phân hệ Xác thực & Bảo mật (Auth & Identity Module)**
  - File: `src/modules/auth/auth-service.ts`, `src/app/actions/auth.ts`, `src/middleware.ts`
  - Chi tiết:
    - [x] Đăng ký / Đăng nhập tạo user trong CSDL kèm mã hóa phiên làm việc.
    - [x] Next.js Edge Middleware bảo vệ các tuyến đường `/vendor/*` và `/admin/*` theo vai trò (RBAC).
- [x] **Task 5.3: Phân hệ Gian hàng & Onboarding (Vendor Module)**
  - File: `src/modules/vendor/vendor-service.ts`, `src/app/actions/onboard.ts`, `src/app/actions/vendor.ts`
  - Chi tiết:
    - [x] Đăng ký mở shop, tạo slug tự động, gắn cờ trạng thái `ACTIVE`.
    - [x] API lấy số liệu doanh thu và thống kê tài chính riêng biệt của Vendor.
    - [x] Cập nhật nhanh số lượng tồn kho của SKU từ dashboard người bán.
- [x] **Task 5.4: Phân hệ Danh mục & Sản phẩm (Catalog Module)**
  - File: `src/modules/catalog/product-service.ts`
  - Chi tiết:
    - [x] Tạo sản phẩm kèm nhiều biến thể SKU và khởi tạo bản ghi tồn kho tương ứng trong một Transaction cục bộ.
    - [x] Truy vấn sản phẩm theo slug kèm eager load thông tin shop và danh mục.
- [x] **Task 5.5: Phân hệ Giỏ hàng & Tách Đơn Hàng (Cart & Order Module)**
  - File: `src/modules/order/checkout-service.ts`, `src/app/actions/checkout.ts`
  - Chi tiết:
    - [x] Gom nhóm sản phẩm theo `vendorId` ngay khi nhận dữ liệu từ giỏ hàng.
    - [x] Tạo `masterOrders` và tự động phân tách thành các `vendorOrders` con trong cùng một Transaction CSDL.
    - [x] Ghi bản ghi sự kiện `OrderCreatedEvent` vào bảng `outboxEvents`.
- [x] **Task 5.6: Phân hệ Tồn kho Hướng Sự Kiện (Inventory Module)**
  - File: `src/modules/inventory/inventory-service.ts`
  - Chi tiết:
    - [x] Đăng ký lắng nghe sự kiện `OrderCreatedEvent` từ `eventBus`.
    - [x] Trừ số lượng tồn khả dụng (`availableStock`) có kiểm tra điều kiện chống bán âm (`availableStock >= quantity`).
    - [x] Tăng số phiên bản `version = version + 1` phòng chống xung đột cạnh tranh đồng thời (Optimistic Concurrency Control).
- [x] **Task 5.7: Phân hệ Thanh toán & Giảm giá (Billing & Voucher Module)**
  - File: `src/modules/billing/billing-service.ts`, `src/app/actions/voucher.ts`, `src/app/actions/order-lifecycle.ts`
  - Chi tiết:
    - [x] Hỗ trợ thanh toán COD và xác nhận thanh toán giả lập Sandbox (cập nhật trạng thái `PAID` cho cả Master và Sub-Orders).
    - [x] Động cơ kiểm tra mã voucher: kiểm tra tính hợp lệ, hạn mức đơn tối thiểu, số tiền chiết khấu.
    - [x] Quản lý vòng đời khiếu nại (Gửi khiếu nại -> Admin trọng tài giải quyết).
    - [x] Ghi nhận đánh giá sản phẩm và tự động kích hoạt giải ngân sớm nếu đạt 5 sao.

---

### Giai đoạn 6: Kiểm thử Tự động & Đảm bảo Chất lượng (Testing & QA)
- [x] **Task 6.1: Bộ Kiểm thử Tích hợp Đầu-Cuối (End-to-End Verification Suite)**
  - File: `scripts/test-e2e.ts`
  - Chi tiết:
    - [x] Kịch bản 1: Chọn khách hàng & tìm sản phẩm từ 2 Vendor khác nhau.
    - [x] Kịch bản 2: Áp dụng mã giảm giá `KEEB50K` và kiểm tra chiết khấu chính xác.
    - [x] Kịch bản 3: Thực hiện checkout giỏ hàng đa shop và kiểm tra tạo đúng 1 MasterOrder + 2 VendorOrders.
    - [x] Kịch bản 4: Kiểm tra sự kiện Outbox kích hoạt trừ tồn kho chính xác theo số lượng mua.
    - [x] Kịch bản 5: Tạo sản phẩm mới đa biến thể SKU trong một Database Transaction.
    - [x] Kịch bản 6: Khởi tạo khiếu nại đơn hàng ký quỹ và Admin giải quyết hoàn tiền thành công.
    - [x] Kịch bản 7: Gửi đánh giá sản phẩm 5 sao và kích hoạt giải ngân ký quỹ sớm.
- [x] **Task 6.2: Kiểm tra Tính Hợp lệ Mã nguồn & Biên dịch Sản phẩm**
  - Command: `pnpm run build`
  - Chi tiết:
    - [x] Kiểm tra Type-check TypeScript 100% không có lỗi.
    - [x] Biên dịch Next.js 15 App Router thành công (10 static routes, dynamic SSR routes).

---

### Giai đoạn 7: Các Tính Năng Nâng Cao Tiếp Theo (Should-Have & Polish)
- [x] **Task 7.1: Tích hợp Cổng Thanh Toán VietQR Tự Động & Webhook**
  - File: `src/modules/billing/vietqr-service.ts`, `src/app/api/webhooks/payment/route.ts`, `src/app/cart/page.tsx`, `src/components/order/OrderSuccessTrackingClient.tsx`, `src/app/actions/checkout.ts`
  - Chi tiết:
    - [x] Sinh mã VietQR động chuẩn Napas QuickLink 24/7 theo từng mã đơn hàng và số tiền chính xác.
    - [x] Tạo Webhook API `/api/webhooks/payment` hỗ trợ cập nhật tự động `PAID` cho Master và Sub-Orders kèm kiểm tra chữ ký/secret.
    - [x] Tạo endpoint GET polling cho client theo dõi trạng thái thanh toán thời gian thực.
    - [x] Giao diện theo dõi đơn hàng tích hợp QR code động, bộ sao chép 1-click và nút mô phỏng Webhook kiểm thử.
- [x] **Task 7.2: Quản lý File & Ảnh Thực Tế (Cloudinary / Supabase Storage)**
  - File: `src/shared/storage/upload-service.ts`, `src/app/api/upload/route.ts`, `src/components/vendor/ProductCreationClient.tsx`, `.gitignore`
  - Chi tiết:
    - [x] Xây dựng service upload hỗ trợ Supabase Storage bucket `products` và cơ chế fallback an toàn lưu trữ đĩa cục bộ `public/uploads/`.
    - [x] Tạo Route Handler `/api/upload` tiếp nhận FormData, xác thực định dạng ảnh (PNG, JPG, WEBP, GIF) và giới hạn 5MB.
    - [x] Cập nhật giao diện Vendor Studio Product Creation với nút tải tệp từ máy tính, thanh trạng thái tải lên và preview thời gian thực.
    - [x] Cấu hình `.gitignore` loại trừ thư mục `public/uploads/` đảm bảo kho mã nguồn luôn gọn gàng.
- [x] **Task 7.3: Thông Báo Thời Gian Thực Cho Vendor (Realtime Orders Notification)**
  - File: `src/app/api/vendor/live-orders/route.ts`, `src/components/vendor/LiveOrderNotifier.tsx`, `src/components/vendor/VendorDashboardClient.tsx`
  - Chi tiết:
    - [x] Tạo API Endpoint `/api/vendor/live-orders` hỗ trợ lọc và lấy các kiện hàng mới của xưởng dựa theo timestamp.
    - [x] Thiết kế component thông báo nổi `LiveOrderNotifier` với hiệu ứng hoạt họa cao cấp, hiển thị mã đơn, khách hàng và giá trị đơn hàng.
    - [x] Tự động kích hoạt cơ chế `router.refresh()` khi nhận đơn hàng mới giúp bảng thống kê trên Dashboard cập nhật tức thì.
- [x] **Task 7.4: Tách Tự Động Hoa Hồng Sàn & Phí Vận Chuyển (Automated Commission Deduction)**
  - File: `src/modules/billing/commission-service.ts`, `src/app/vendor/payouts/page.tsx`, `src/components/vendor/VendorPayoutsClient.tsx`
  - Chi tiết:
    - [x] Xây dựng `commission-service.ts` định nghĩa tỷ lệ hoa hồng chuẩn 5% sàn Vendora, tính toán chi tiết Gross, Fee và Net Vendor Payout.
    - [x] Hàm `getVendorPayoutLedger` truy vấn lịch sử đơn hàng thực tế của shop từ CSDL, tự động phân tách số dư khả dụng (`availablePayout`) và số dư đang giữ ký quỹ (`escrowHolding`).
    - [x] Tích hợp trang Sổ cái doanh thu và đối soát rút tiền `/vendor/payouts` hiển thị dữ liệu động thời gian thực.

---

### Giai đoạn 8: Đóng Gói Docker & Vận Hành Staging/Production (DevOps & Deployment)
- [x] **Task 8.1: Tạo Dockerfile Đa Tầng (Multi-stage Build Dockerfile)**
  - File: `Dockerfile`, `.dockerignore`, `next.config.ts`
  - Chi tiết:
    - [x] Bật chế độ `output: "standalone"` trong `next.config.ts` để Next.js tạo gói bundle siêu gọn nhẹ.
    - [x] Xây dựng `Dockerfile` 4 tầng: `base` (Node 20 Alpine & pnpm) $\rightarrow$ `deps` (cài phụ thuộc) $\rightarrow$ `builder` (biên dịch production) $\rightarrow$ `runner` (chạy standalone dưới quyền user non-root `nextjs:nodejs`).
    - [x] Tạo `.dockerignore` loại trừ node_modules, .git, cache và các file nhạy cảm.
- [ ] **Task 8.2: Tạo Docker Compose cho Local Full-Stack**
  - Mục tiêu: Khởi chạy Postgres + App chỉ bằng một lệnh `docker-compose up -d`.
  - Files dự kiến: `docker-compose.yml`
- [ ] **Task 8.3: Cấu hình GitHub Actions CI Pipeline**
  - Mục tiêu: Tự động chạy `pnpm lint`, `pnpm build`, và `pnpm test:e2e` trên mỗi Pull Request.
  - Files dự kiến: `.github/workflows/ci.yml`

---

## 📦 KẾ HOẠCH CAM KẾT MÃ NGUỒN NGUYÊN TỬ (ATOMIC COMMITS ROADMAP)

Để đảm bảo lịch sử Git sạch, rõ ràng và tuân thủ quy chuẩn **Conventional Commits**, toàn bộ mã nguồn hiện tại sẽ được chia nhỏ thành **14 commits tuần tự**:

| STT | Loại Commit | Tiêu đề Commit | Danh mục File bao gồm |
| :---: | :--- | :--- | :--- |
| **01** | `chore` | `chore: initialize project configuration, workspace and dependencies` | `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `.gitignore`, `.env.example`, `next-env.d.ts` |
| **02** | `docs` | `docs: add product requirements document (PRD) and design system specifications` | `docs/PRD.md`, `docs/DESIGN_SYSTEM.md`, `docs/ARCHITECTURE_GRAPH.md` |
| **03** | `feat(db)` | `feat(db): implement drizzle orm schema and database seeding script` | `src/shared/db/schema.ts`, `src/shared/db/index.ts`, `drizzle.config.ts`, `scripts/seed.ts`, `src/shared/supabase/*` |
| **04** | `feat(events)` | `feat(events): implement in-process domain event bus and transactional outbox` | `src/shared/events/event-bus.ts`, `src/shared/events/outbox-processor.ts` |
| **05** | `feat(backend)` | `feat(backend): implement domain modules for auth, catalog, cart, order splitting, inventory and billing` | `src/modules/auth/*`, `src/modules/catalog/*`, `src/modules/cart/*`, `src/modules/order/*`, `src/modules/inventory/*`, `src/modules/billing/*`, `src/modules/vendor/*` |
| **06** | `feat(actions)` | `feat(actions): implement next.js server actions and authentication middleware` | `src/app/actions/*`, `src/middleware.ts` |
| **07** | `feat(ui)` | `feat(ui): implement sovereign design system layout, header, footer, tokens and cart context` | `src/app/globals.css`, `src/app/layout.tsx`, `src/components/layout/*`, `src/components/cart/CartContext.tsx` |
| **08** | `feat(frontend)` | `feat(frontend): implement marketplace storefront and catalog search pages` | `src/app/page.tsx`, `src/app/search/page.tsx`, `src/components/catalog/ProductCard.tsx`, `src/components/search/*` |
| **09** | `feat(frontend)` | `feat(frontend): implement product detail page with multi-sku selector and escrow badge` | `src/app/products/[slug]/page.tsx`, `src/components/catalog/ProductDetailClient.tsx` |
| **10** | `feat(frontend)` | `feat(frontend): implement multi-vendor cart and order splitting checkout flow` | `src/app/cart/page.tsx`, `src/app/orders/[id]/*`, `src/components/order/OrderSuccessTrackingClient.tsx` |
| **11** | `feat(frontend)` | `feat(frontend): implement vendor studio dashboard, onboarding, product creation and payouts` | `src/app/vendor/*`, `src/app/store/[slug]/*`, `src/components/vendor/*` |
| **12** | `feat(frontend)` | `feat(frontend): implement buyer account, admin moderation and escrow dispute & review flows` | `src/app/account/*`, `src/app/admin/*`, `src/app/orders/[id]/dispute/*`, `src/app/orders/[id]/review/*`, `src/app/login/*`, `src/components/admin/*`, `src/components/order/*`, `src/components/auth/*`, `src/components/account/*` |
| **13** | `test(e2e)` | `test(e2e): implement end-to-end integration test suite for multi-vendor lifecycle` | `scripts/test-e2e.ts` |
| **14** | `docs` | `docs: add PROGRESS.md tracking project roadmap and milestones` | `PROGRESS.md` |
