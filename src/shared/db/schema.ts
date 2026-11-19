import { pgTable, uuid, text, timestamp, decimal, integer, pgEnum, jsonb, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==========================================
// 1. ENUMS
// ==========================================
export const userRoleEnum = pgEnum("user_role", ["BUYER", "VENDOR", "ADMIN"]);
export const vendorStatusEnum = pgEnum("vendor_status", ["PENDING_APPROVAL", "ACTIVE", "SUSPENDED"]);
export const orderStatusEnum = pgEnum("order_status", ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]);
export const paymentStatusEnum = pgEnum("payment_status", ["PENDING", "PAID", "FAILED"]);
export const outboxStatusEnum = pgEnum("outbox_status", ["PENDING", "PROCESSED", "FAILED"]);

// ==========================================
// 2. USERS
// ==========================================
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash"),
  fullName: text("full_name"),
  role: userRoleEnum("role").default("BUYER").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 3. VENDORS (Multi-Vendor Shops)
// ==========================================
export const vendors = pgTable("vendors", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  shopName: text("shop_name").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  badge: text("badge").default("Verified Merchant").notNull(),
  location: text("location").default("Hà Nội").notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.00").notNull(),
  status: vendorStatusEnum("status").default("ACTIVE").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 4. CATEGORIES
// ==========================================
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  parentId: uuid("parent_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 5. PRODUCTS & SKUS
// ==========================================
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
  categoryId: uuid("category_id").references(() => categories.id).notNull(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  specs: jsonb("specs").default({}),
  status: text("status").default("PUBLISHED").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const productSkus = pgTable("product_skus", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  skuCode: text("sku_code").unique().notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  attributes: jsonb("attributes").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 6. INVENTORY
// ==========================================
export const inventoryItems = pgTable("inventory_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  skuId: uuid("sku_id").references(() => productSkus.id, { onDelete: "cascade" }).unique().notNull(),
  availableStock: integer("available_stock").default(0).notNull(),
  reservedStock: integer("reserved_stock").default(0).notNull(),
  version: integer("version").default(1).notNull(), // Optimistic locking
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// 7. ORDERS (Master & Vendor Orders)
// ==========================================
export const masterOrders = pgTable("master_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: text("order_number"),
  buyerId: uuid("buyer_id").references(() => users.id).notNull(),
  recipientName: text("recipient_name"),
  recipientPhone: text("recipient_phone"),
  shippingAddress: text("shipping_address").notNull(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").default("COD").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").default("PENDING").notNull(),
  overallStatus: orderStatusEnum("overall_status").default("PENDING").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const vendorOrders = pgTable("vendor_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  subOrderNumber: text("sub_order_number"),
  masterOrderId: uuid("master_order_id").references(() => masterOrders.id, { onDelete: "cascade" }).notNull(),
  vendorId: uuid("vendor_id").references(() => vendors.id).notNull(),
  subtotalAmount: decimal("subtotal_amount", { precision: 12, scale: 2 }).notNull(),
  shippingFee: decimal("shipping_fee", { precision: 12, scale: 2 }).default("0.00").notNull(),
  status: orderStatusEnum("status").default("PENDING").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  vendorOrderId: uuid("vendor_order_id").references(() => vendorOrders.id, { onDelete: "cascade" }).notNull(),
  skuId: uuid("sku_id").references(() => productSkus.id).notNull(),
  productTitle: text("product_title").default(""),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
});

// ==========================================
// 8. OUTBOX EVENTS
// ==========================================
export const outboxEvents = pgTable("outbox_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventType: text("event_type").notNull(),
  aggregateType: text("aggregate_type").notNull(),
  aggregateId: uuid("aggregate_id").notNull(),
  payload: jsonb("payload").notNull(),
  status: outboxStatusEnum("status").default("PENDING").notNull(),
  retryCount: integer("retry_count").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }),
});

// ==========================================
// 9. REVIEWS & DISPUTES & VOUCHERS
// ==========================================
export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  buyerId: uuid("buyer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  vendorOrderId: uuid("vendor_order_id").references(() => vendorOrders.id, { onDelete: "set null" }),
  rating: integer("rating").notNull(), // 1 to 5
  craftRating: integer("craft_rating").default(5).notNull(),
  reviewText: text("review_text").notNull(),
  images: jsonb("images").default([]).notNull(),
  isAnonymous: boolean("is_anonymous").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const disputes = pgTable("disputes", {
  id: uuid("id").defaultRandom().primaryKey(),
  disputeNumber: text("dispute_number").unique().notNull(),
  masterOrderId: uuid("master_order_id").references(() => masterOrders.id, { onDelete: "cascade" }).notNull(),
  vendorOrderId: uuid("vendor_order_id").references(() => vendorOrders.id, { onDelete: "cascade" }).notNull(),
  buyerId: uuid("buyer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  issueType: text("issue_type").notNull(), // DAMAGED_IN_TRANSIT | WRONG_ITEM | DEFECTIVE
  description: text("description").notNull(),
  desiredResolution: text("desired_resolution").default("REFUND_VIETQR").notNull(),
  photos: jsonb("photos").default([]).notNull(),
  status: text("status").default("OPEN").notNull(), // OPEN | RESOLVED_REFUND | RESOLVED_REJECTED
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
});

export const vouchers = pgTable("vouchers", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").unique().notNull(),
  title: text("title").notNull(),
  discountType: text("discount_type").default("FIXED_AMOUNT").notNull(), // FIXED_AMOUNT | PERCENTAGE
  discountValue: decimal("discount_value", { precision: 12, scale: 2 }).notNull(),
  minOrderAmount: decimal("min_order_amount", { precision: 12, scale: 2 }).default("0.00").notNull(),
  vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }), // null if platform-wide
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// 10. RELATIONS
// ==========================================
export const usersRelations = relations(users, ({ one, many }) => ({
  vendor: one(vendors, { fields: [users.id], references: [vendors.userId] }),
  masterOrders: many(masterOrders),
  reviews: many(reviews),
  disputes: many(disputes),
}));

export const vendorsRelations = relations(vendors, ({ one, many }) => ({
  user: one(users, { fields: [vendors.userId], references: [users.id] }),
  products: many(products),
  vendorOrders: many(vendorOrders),
  vouchers: many(vouchers),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  vendor: one(vendors, { fields: [products.vendorId], references: [vendors.id] }),
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  skus: many(productSkus),
  reviews: many(reviews),
}));

export const productSkusRelations = relations(productSkus, ({ one }) => ({
  product: one(products, { fields: [productSkus.productId], references: [products.id] }),
  inventory: one(inventoryItems, { fields: [productSkus.id], references: [inventoryItems.skuId] }),
}));

export const inventoryItemsRelations = relations(inventoryItems, ({ one }) => ({
  sku: one(productSkus, { fields: [inventoryItems.skuId], references: [productSkus.id] }),
}));

export const masterOrdersRelations = relations(masterOrders, ({ one, many }) => ({
  buyer: one(users, { fields: [masterOrders.buyerId], references: [users.id] }),
  vendorOrders: many(vendorOrders),
  disputes: many(disputes),
}));

export const vendorOrdersRelations = relations(vendorOrders, ({ one, many }) => ({
  masterOrder: one(masterOrders, { fields: [vendorOrders.masterOrderId], references: [masterOrders.id] }),
  vendor: one(vendors, { fields: [vendorOrders.vendorId], references: [vendors.id] }),
  items: many(orderItems),
  reviews: many(reviews),
  disputes: many(disputes),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  vendorOrder: one(vendorOrders, { fields: [orderItems.vendorOrderId], references: [vendorOrders.id] }),
  sku: one(productSkus, { fields: [orderItems.skuId], references: [productSkus.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  buyer: one(users, { fields: [reviews.buyerId], references: [users.id] }),
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
  vendorOrder: one(vendorOrders, { fields: [reviews.vendorOrderId], references: [vendorOrders.id] }),
}));

export const disputesRelations = relations(disputes, ({ one }) => ({
  masterOrder: one(masterOrders, { fields: [disputes.masterOrderId], references: [masterOrders.id] }),
  vendorOrder: one(vendorOrders, { fields: [disputes.vendorOrderId], references: [vendorOrders.id] }),
  buyer: one(users, { fields: [disputes.buyerId], references: [users.id] }),
}));

export const vouchersRelations = relations(vouchers, ({ one }) => ({
  vendor: one(vendors, { fields: [vouchers.vendorId], references: [vendors.id] }),
}));
