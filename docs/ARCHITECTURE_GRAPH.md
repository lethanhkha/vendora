# Graph Report - Vendora  (2026-11-18)

## Corpus Check
- Corpus is ~39,516 words - fits in a single context window. You may not need a graph.

## Summary
- 343 nodes · 730 edges · 15 communities (11 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Order Lifecycle & DB Operations
- Project Dependencies & DB Config
- Buyer Portal & Layout Shell
- Marketplace Search & Admin
- Design System & Architecture Specs
- Order Tracking & Dispute Resolution
- Checkout & Onboarding Services
- Vendor Dashboard & Boutique Store
- TypeScript Configuration
- Supabase Authentication & Middleware
- NPM Scripts & Build Tooling
- PNPM Workspace Configuration
- PostCSS & Styling Config
- Product Requirements & Metrics

## God Nodes (most connected - your core abstractions)
1. `react` - 35 edges
2. `next` - 34 edges
3. `lucide-react` - 21 edges
4. `drizzle-orm` - 16 edges
5. `compilerOptions` - 16 edges
6. `db` - 14 edges
7. `useCart()` - 13 edges
8. `scripts` - 10 edges
9. `getMasterOrderDetails()` - 9 edges
10. `processCheckout()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `runE2ETests()` --calls--> `processCheckout()`  [EXTRACTED]
  scripts/test-e2e.ts → src/modules/order/checkout-service.ts
- `runE2ETests()` --calls--> `resolveDisputeAction()`  [EXTRACTED]
  scripts/test-e2e.ts → src/app/actions/order-lifecycle.ts
- `runE2ETests()` --calls--> `submitDisputeAction()`  [EXTRACTED]
  scripts/test-e2e.ts → src/app/actions/order-lifecycle.ts
- `runE2ETests()` --calls--> `submitReviewAction()`  [EXTRACTED]
  scripts/test-e2e.ts → src/app/actions/order-lifecycle.ts
- `runE2ETests()` --calls--> `validateVoucherAction()`  [EXTRACTED]
  scripts/test-e2e.ts → src/app/actions/voucher.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Event-Driven Checkout, Order Splitting & Inventory Deduction Flow** — docs_prd_cart_order_module, docs_prd_order_splitting, docs_prd_transactional_outbox, docs_prd_inventory_module, docs_prd_billing_module [EXTRACTED 1.00]
- **Multi-Tenant Vendor Isolation & Security Defense-in-Depth** — docs_prd_auth_module, docs_prd_catalog_module, docs_prd_rls_tenant_isolation, docs_prd_owasp_security, docs_prd_database_schema [EXTRACTED 1.00]
- **Clean Kinetic Commerce 4-Screen Stitch UI Architecture** — docs_design_system_clean_kinetic_commerce, docs_design_system_screen_storefront, docs_design_system_screen_pdp, docs_design_system_screen_cart_checkout, docs_design_system_screen_vendor_studio [EXTRACTED 1.00]

## Communities (15 total, 4 thin omitted)

### Community 0 - "Order Lifecycle & DB Operations"
Cohesion: 0.08
Nodes (43): dotenv, drizzle-orm, runE2ETests(), resolveDisputeAction(), safeRevalidate(), submitDisputeAction(), submitReviewAction(), validateVoucherAction() (+35 more)

### Community 1 - "Project Dependencies & DB Config"
Cohesion: 0.06
Nodes (41): dependencies, clsx@^2.1.1, dotenv@^16.4.7, drizzle-orm@^0.39.3, lucide-react@^0.475.0, next@^15.1.7, postgres@^3.4.5, react@^19.0.0 (+33 more)

### Community 2 - "Buyer Portal & Layout Shell"
Cohesion: 0.08
Nodes (29): nextConfig, next, BuyerOrdersPage(), revalidate, CartPage(), metadata, RootLayout(), ProductPage() (+21 more)

### Community 3 - "Marketplace Search & Admin"
Cohesion: 0.12
Nodes (24): lucide-react, react, getAllDisputesForAdmin(), createProductAction(), AdminPage(), revalidate, HomePage(), revalidate (+16 more)

### Community 4 - "Design System & Architecture Specs"
Cohesion: 0.10
Nodes (32): Clean Kinetic Commerce Design Philosophy, Vendora Color Tokens (Electric Indigo #4F46E5, Royal Violet #7C3AED, Warm Amber #F59E0B, Obsidian Slate #0F172A, Emerald #10B981), DESIGN_SYSTEM.md (Vendora Sovereign Design System), 15-Day Escrow Protection, Google Stitch Project (2437820855179381593), Multi-Store Bundle & Order Splitting Transparency UI, Local & Sandbox Payment Methods (VietQR, MoMo, ZaloPay, NAPAS, COD), Screen 3: Multi-Vendor Cart & Checkout (+24 more)

### Community 5 - "Order Tracking & Dispute Resolution"
Cohesion: 0.11
Nodes (20): updateVendorOrderStatusAction(), DisputePageProps, OrderDisputePage(), OrderDetailPage(), revalidate, OrderReviewPage(), ReviewPageProps, VendorOrderPage() (+12 more)

### Community 6 - "Checkout & Onboarding Services"
Cohesion: 0.14
Nodes (17): getCurrentUser(), submitCheckoutAction(), onboardVendorAction(), VendorOnboardingPage(), getOrCreateUser(), confirmSandboxPayment(), CheckoutInput, processCheckout() (+9 more)

### Community 7 - "Vendor Dashboard & Boutique Store"
Cohesion: 0.18
Nodes (14): adjustStockAction(), revalidate, VendorStorePage(), revalidate, VendorDashboardPage(), BoutiqueStorefrontClient(), ProductItem, VendorData (+6 more)

### Community 8 - "TypeScript Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "Supabase Authentication & Middleware"
Cohesion: 0.18
Nodes (10): @supabase/ssr@^0.5.2, @supabase/ssr, AuthResponse, loginAction(), logoutAction(), signupAction(), LoginPage(), AuthPortalClient() (+2 more)

### Community 10 - "NPM Scripts & Build Tooling"
Cohesion: 0.20
Nodes (10): scripts, build, db:generate, db:push, db:studio, dev, lint, seed (+2 more)

## Ambiguous Edges - Review These
- `15-Day Escrow Protection` → `Billing & Payment Module (BILL-01 COD & Sandbox Mock, BILL-02, BILL-03)`  [AMBIGUOUS]
  docs/DESIGN_SYSTEM.md · relation: conceptually_related_to

## Knowledge Gaps
- **7 isolated node(s):** `DESIGN_SYSTEM.md (Vendora Sovereign Design System)`, `Plus Jakarta Sans & VND Currency Format`, `PRD.md (Vendora Multi-Vendor E-Commerce MVP)`, `User Personas (Buyer, Vendor, Platform Admin)`, `MVP Goals & Success Metrics (Checkout >=70%, Onboarding <=5m, 0% Overselling, P95 <=200ms/500ms)` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 112 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Marketplace Search & Admin` to `Project Dependencies & DB Config`, `Buyer Portal & Layout Shell`, `Order Tracking & Dispute Resolution`, `Checkout & Onboarding Services`, `Vendor Dashboard & Boutique Store`, `Supabase Authentication & Middleware`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **What connects `DESIGN_SYSTEM.md (Vendora Sovereign Design System)`, `Plus Jakarta Sans & VND Currency Format`, `PRD.md (Vendora Multi-Vendor E-Commerce MVP)` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Order Lifecycle & DB Operations` be split into smaller, more focused modules?**
  _Cohesion score 0.08045977011494253 - nodes in this community are weakly interconnected._
- **Why does `next` connect `Buyer Portal & Layout Shell` to `Order Lifecycle & DB Operations`, `Project Dependencies & DB Config`, `Marketplace Search & Admin`, `Order Tracking & Dispute Resolution`, `Checkout & Onboarding Services`, `Vendor Dashboard & Boutique Store`, `Supabase Authentication & Middleware`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Should `Project Dependencies & DB Config` be split into smaller, more focused modules?**
  _Cohesion score 0.057971014492753624 - nodes in this community are weakly interconnected._
- **Why does `drizzle-orm` connect `Order Lifecycle & DB Operations` to `Project Dependencies & DB Config`, `Checkout & Onboarding Services`, `Supabase Authentication & Middleware`, `Vendor Dashboard & Boutique Store`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `15-Day Escrow Protection` and `Billing & Payment Module (BILL-01 COD & Sandbox Mock, BILL-02, BILL-03)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._