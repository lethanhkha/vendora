"use server";

import { db, users, vendors } from "@/shared/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  getSessionPayload,
} from "@/shared/auth/session";

export type AuthResponse = {
  success: boolean;
  error?: string;
  role?: "BUYER" | "VENDOR" | "ADMIN";
  userId?: string;
};

export async function loginAction(formData: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const { email, password } = formData;
  if (!email || !password) {
    return { success: false, error: "Vui lòng nhập đầy đủ email và mật khẩu." };
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const [dbUser] = await db.select().from(users).where(eq(users.email, cleanEmail));

    if (!dbUser) {
      return { success: false, error: "Tài khoản hoặc mật khẩu không chính xác." };
    }

    // Verify password if hash exists, or auto-enroll password for existing demo accounts
    if (dbUser.passwordHash) {
      const isValid = verifyPassword(password, dbUser.passwordHash);
      if (!isValid) {
        return { success: false, error: "Tài khoản hoặc mật khẩu không chính xác." };
      }
    } else {
      // First-time login for seeded account without password hash
      const newHash = hashPassword(password);
      await db
        .update(users)
        .set({ passwordHash: newHash, updatedAt: new Date() })
        .where(eq(users.id, dbUser.id));
    }

    // Set secure session cookie
    const token = createSessionToken({
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
    });
    await setSessionCookie(token);

    revalidatePath("/", "layout");
    return {
      success: true,
      role: dbUser.role,
      userId: dbUser.id,
    };
  } catch (err: any) {
    console.error("[loginAction] Error:", err);
    return { success: false, error: err.message || "Lỗi máy chủ khi đăng nhập." };
  }
}

export async function signupAction(data: {
  email: string;
  password: string;
  fullName: string;
  role: "BUYER" | "VENDOR";
  shopName?: string;
  location?: string;
}): Promise<AuthResponse> {
  const { email, password, fullName, role, shopName, location } = data;

  if (!email || !password || !fullName) {
    return { success: false, error: "Vui lòng nhập đầy đủ thông tin đăng ký." };
  }

  if (password.length < 6) {
    return { success: false, error: "Mật khẩu phải có ít nhất 6 ký tự." };
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const [existing] = await db.select().from(users).where(eq(users.email, cleanEmail));
    if (existing) {
      return { success: false, error: "Email này đã được sử dụng. Vui lòng đăng nhập." };
    }

    const passwordHash = hashPassword(password);

    const [dbUser] = await db
      .insert(users)
      .values({
        email: cleanEmail,
        passwordHash,
        fullName,
        role,
      })
      .returning();

    // If registering as VENDOR, auto-create the boutique vendor record
    if (role === "VENDOR" && shopName) {
      const slug = shopName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const uniqueSlug = `${slug}-${Date.now().toString().slice(-4)}`;

      await db
        .insert(vendors)
        .values({
          userId: dbUser.id,
          shopName,
          slug: uniqueSlug,
          description: `Gian hàng thủ công của ${fullName}`,
          location: location || "Hà Nội",
          badge: "New Maker",
          status: "ACTIVE",
        })
        .onConflictDoNothing();
    }

    const token = createSessionToken({
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
    });
    await setSessionCookie(token);

    revalidatePath("/", "layout");
    return {
      success: true,
      role,
      userId: dbUser.id,
    };
  } catch (err: any) {
    console.error("[signupAction] Error:", err);
    return { success: false, error: err.message || "Lỗi máy chủ khi đăng ký." };
  }
}

export async function logoutAction() {
  await clearSessionCookie();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function getCurrentUser() {
  try {
    const session = await getSessionPayload();
    if (!session || !session.userId) return null;

    const [dbUser] = await db.select().from(users).where(eq(users.id, session.userId));
    if (!dbUser) return null;

    let vendor = null;
    if (dbUser.role === "VENDOR") {
      const [v] = await db.select().from(vendors).where(eq(vendors.userId, dbUser.id));
      vendor = v || null;
    }

    return {
      ...dbUser,
      vendor,
    };
  } catch {
    return null;
  }
}
