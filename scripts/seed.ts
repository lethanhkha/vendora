import { db, users, vendors, categories, products, productSkus, inventoryItems } from "../src/shared/db";
import { hashPassword } from "../src/shared/auth/session";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seed() {
  console.log("🌱 Starting Vendora Seed Process...");

  // 1. Create Users
  console.log("Creating default users with native auth credentials...");
  const defaultPasswordHash = hashPassword("password123");

  const [buyerUser] = await db
    .insert(users)
    .values({
      email: "buyer@vendora.vn",
      passwordHash: defaultPasswordHash,
      fullName: "Minh Anh",
      role: "BUYER",
    })
    .onConflictDoUpdate({
      target: users.email,
      set: { passwordHash: defaultPasswordHash, updatedAt: new Date() },
    })
    .returning();

  const [adminUser] = await db
    .insert(users)
    .values({
      email: "admin@vendora.vn",
      passwordHash: defaultPasswordHash,
      fullName: "Quản Trị Viên Vendora",
      role: "ADMIN",
    })
    .onConflictDoUpdate({
      target: users.email,
      set: { passwordHash: defaultPasswordHash, role: "ADMIN", updatedAt: new Date() },
    })
    .returning();

  const [vendor1User] = await db
    .insert(users)
    .values({
      email: "keebcraft@vendora.vn",
      passwordHash: defaultPasswordHash,
      fullName: "Tuấn Hoàng (KeebCraft)",
      role: "VENDOR",
    })
    .onConflictDoUpdate({
      target: users.email,
      set: { passwordHash: defaultPasswordHash, updatedAt: new Date() },
    })
    .returning();

  const [vendor2User] = await db
    .insert(users)
    .values({
      email: "auraleather@vendora.vn",
      passwordHash: defaultPasswordHash,
      fullName: "Lê Nam (Aura Leather)",
      role: "VENDOR",
    })
    .onConflictDoUpdate({
      target: users.email,
      set: { passwordHash: defaultPasswordHash, updatedAt: new Date() },
    })
    .returning();

  const [vendor3User] = await db
    .insert(users)
    .values({
      email: "battrang@vendora.vn",
      passwordHash: defaultPasswordHash,
      fullName: "Nghệ nhân Trần Bình",
      role: "VENDOR",
    })
    .onConflictDoUpdate({
      target: users.email,
      set: { passwordHash: defaultPasswordHash, updatedAt: new Date() },
    })
    .returning();

  // Retrieve user IDs
  const allUsers = await db.select().from(users);
  const v1Id = allUsers.find((u) => u.email === "keebcraft@vendora.vn")!.id;
  const v2Id = allUsers.find((u) => u.email === "auraleather@vendora.vn")!.id;
  const v3Id = allUsers.find((u) => u.email === "battrang@vendora.vn")!.id;

  // 2. Create Vendors
  console.log("Creating boutique vendors...");
  const [v1] = await db
    .insert(vendors)
    .values({
      userId: v1Id,
      shopName: "KeebCraft VN",
      slug: "keebcraft-vn",
      description: "Xưởng thủ công bàn phím cơ gỗ óc chó và phụ kiện công nghệ cao cấp tại Hà Nội.",
      logoUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
      badge: "Heritage Maker",
      location: "Ba Đình, Hà Nội",
      rating: "4.96",
      status: "ACTIVE",
    })
    .onConflictDoNothing()
    .returning();

  const [v2] = await db
    .insert(vendors)
    .values({
      userId: v2Id,
      shopName: "Aura Saigon Leather",
      slug: "aura-saigon-leather",
      description: "Đồ da thủ công cao cấp từ da bò sáp nhập khẩu Ý, may tay thủ công tại Sài Gòn.",
      logoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      badge: "Verified Artisan",
      location: "Quận 1, TP. Hồ Chí Minh",
      rating: "4.92",
      status: "ACTIVE",
    })
    .onConflictDoNothing()
    .returning();

  const [v3] = await db
    .insert(vendors)
    .values({
      userId: v3Id,
      shopName: "Gốm Bát Tràng Atelier",
      slug: "battrang-atelier",
      description: "Nghệ thuật gốm men hỏa biến gia truyền và đồ trang trí gốm sứ độc bản.",
      logoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
      badge: "Master Craft",
      location: "Bát Tràng, Hà Nội",
      rating: "4.98",
      status: "ACTIVE",
    })
    .onConflictDoNothing()
    .returning();

  const allVendors = await db.select().from(vendors);
  const keebcraftId = allVendors.find((v) => v.slug === "keebcraft-vn")!.id;
  const auraId = allVendors.find((v) => v.slug === "aura-saigon-leather")!.id;
  const battrangId = allVendors.find((v) => v.slug === "battrang-atelier")!.id;

  // 3. Create Categories
  console.log("Creating categories...");
  await db
    .insert(categories)
    .values([
      {
        name: "Công nghệ & Audio",
        slug: "tech-audio",
        description: "Bàn phím cơ, tai nghe kiểm âm và phụ kiện góc làm việc",
        imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=300&q=80",
      },
      {
        name: "Đồ Da & Thủ Công",
        slug: "leather-craft",
        description: "Ví da, deskpad da bò sáp và đồ phụ kiện may tay",
        imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=300&q=80",
      },
      {
        name: "Gốm Sứ & Đời Sống",
        slug: "ceramics-living",
        description: "Bình hoa men hỏa biến, tách trà gốm thủ công",
        imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=300&q=80",
      },
    ])
    .onConflictDoNothing();

  const allCategories = await db.select().from(categories);
  const catTechId = allCategories.find((c) => c.slug === "tech-audio")!.id;
  const catLeatherId = allCategories.find((c) => c.slug === "leather-craft")!.id;
  const catCeramicsId = allCategories.find((c) => c.slug === "ceramics-living")!.id;

  // 4. Create Products & SKUs & Stock
  console.log("Creating boutique products with SKUs and inventory...");

  // Product 1: Bàn phím cơ gỗ óc chó (Stitch Screen 2 hero product)
  const [p1] = await db
    .insert(products)
    .values({
      vendorId: keebcraftId,
      categoryId: catTechId,
      title: "Bàn Phím Cơ Gỗ Óc Chó FAS (Minimalist Walnut 75%)",
      slug: "ban-phim-co-go-oc-cho-fas-75",
      description: "Thân vỏ nguyên khối tiện CNC từ gỗ óc chó Bắc Mỹ hạng FAS. Đã mod foam Poron và lube sẵn switch Krytox 205g0 cho âm thanh thocky trầm ấm.",
      imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
      specs: {
        material: "Gỗ óc chó Bắc Mỹ (FAS Grade)",
        layout: "75% Compact (82 phím)",
        connection: "Type-C, Bluetooth 5.2, 2.4Ghz",
        battery: "4000 mAh (dùng đến 3 tuần)",
        warranty: "24 tháng 1 đổi 1",
      },
      status: "PUBLISHED",
    })
    .onConflictDoNothing()
    .returning();

  if (p1) {
    const [sku1] = await db
      .insert(productSkus)
      .values({
        productId: p1.id,
        skuCode: "KCB-WN75-RED",
        price: "1850000.00",
        attributes: { switch: "Linear Red", layout: "ANSI 75%" },
      })
      .returning();

    await db.insert(inventoryItems).values({
      skuId: sku1.id,
      availableStock: 4, // Matches Stitch PDP: "Only 4 units left"
      reservedStock: 0,
    });
  }

  // Product 2: Desk mat da bò sáp Ý (Aura Saigon Leather)
  const [p2] = await db
    .insert(products)
    .values({
      vendorId: auraId,
      categoryId: catLeatherId,
      title: "Tấm Lót Bàn Làm Việc Da Bò Sáp Ý Thủ Công (Desk Mat 90x40cm)",
      slug: "tam-lot-ban-da-bo-sap-y-90x40",
      description: "Da bò sáp Pull-up thuộc thảo mộc nhập khẩu Tuscany Ý. Cạnh lạng mép và sơn bóng thủ công, tạo patina độc nhất sau thời gian sử dụng.",
      imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
      specs: {
        leather: "Da bò sáp Pull-up Ý",
        thickness: "2.2mm",
        dimension: "900 x 400 mm",
        edge: "Sơn viền chống tưa",
      },
      status: "PUBLISHED",
    })
    .onConflictDoNothing()
    .returning();

  if (p2) {
    const [sku2] = await db
      .insert(productSkus)
      .values({
        productId: p2.id,
        skuCode: "AURA-MAT-BROWN",
        price: "450000.00",
        attributes: { color: "Nâu sáp cổ điển", size: "90x40cm" },
      })
      .returning();

    await db.insert(inventoryItems).values({
      skuId: sku2.id,
      availableStock: 15,
      reservedStock: 0,
    });
  }

  // Product 3: Bình gốm men hỏa biến Sa Mạc (Gốm Bát Tràng Atelier)
  const [p3] = await db
    .insert(products)
    .values({
      vendorId: battrangId,
      categoryId: catCeramicsId,
      title: "Bình Gốm Men Hỏa Biến Sa Mạc (Desert Flare Ceramic Vase)",
      slug: "binh-gom-men-hoa-bien-sa-mac",
      description: "Được nung ở nhiệt độ 1300°C trong lò củi truyền thống, từng vân men hòa quyện tạo thành dải màu sa mạc độc bản không chiếc nào giống chiếc nào.",
      imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
      specs: {
        clay: "Đất sét cao lanh lọc kỹ",
        firing: "Lò củi 1300°C",
        height: "28cm",
        finish: "Men hỏa biến mờ",
      },
      status: "PUBLISHED",
    })
    .onConflictDoNothing()
    .returning();

  if (p3) {
    const [sku3] = await db
      .insert(productSkus)
      .values({
        productId: p3.id,
        skuCode: "BT-VASE-DESERT",
        price: "680000.00",
        attributes: { glaze: "Men hỏa biến Sa Mạc", size: "28cm" },
      })
      .returning();

    await db.insert(inventoryItems).values({
      skuId: sku3.id,
      availableStock: 8,
      reservedStock: 0,
    });
  }

  // Product 4: Tai nghe kiểm âm Audiophile (KeebCraft VN)
  const [p4] = await db
    .insert(products)
    .values({
      vendorId: keebcraftId,
      categoryId: catTechId,
      title: "Tai Nghe Studio Monitor Bluetooth (Audiophile Pro Headset)",
      slug: "tai-nghe-studio-monitor-bluetooth-pro",
      description: "Driver dynamic màng Beryllium 50mm tái tạo âm thanh phòng thu trung thực. Earpad đệm mút hoạt tính bọc da cừu êm ái.",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      specs: {
        driver: "50mm Beryllium",
        dac: "Hi-Res LDAC / aptX HD",
        impedance: "32 Ohm",
        battery: "40 giờ nghe liên tục",
      },
      status: "PUBLISHED",
    })
    .onConflictDoNothing()
    .returning();

  if (p4) {
    const [sku4] = await db
      .insert(productSkus)
      .values({
        productId: p4.id,
        skuCode: "KCB-AUDIO-PRO",
        price: "2450000.00",
        attributes: { color: "Midnight Black" },
      })
      .returning();

    await db.insert(inventoryItems).values({
      skuId: sku4.id,
      availableStock: 6,
      reservedStock: 0,
    });
  }

  console.log("✅ Seed completed successfully with 3 Boutiques and 4 Products matching Stitch designs!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
