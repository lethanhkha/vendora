"use server";

import { createClient } from "@/shared/supabase/server";
import { db, users, vendors } from "@/shared/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.warn("[Auth] signInWithPassword error:", error.message);
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: "Không tìm thấy thông tin tài khoản." };
    }

    // Ensure database profile exists in `users`
    let [dbUser] = await db.select().from(users).where(eq(users.email, email));

    if (!dbUser) {
      const [created] = await db
        .insert(users)
        .values({
          id: data.user.id,
          email,
          fullName: data.user.user_metadata?.full_name || email.split("@")[0],
          role: (data.user.user_metadata?.role as any) || "BUYER",
        })
        .onConflictDoNothing()
        .returning();

      dbUser = created || (await db.select().from(users).where(eq(users.email, email)))[0];
    }

    revalidatePath("/", "layout");
    return {
      success: true,
      role: dbUser?.role || "BUYER",
      userId: dbUser?.id,
    };
  } catch (err: any) {
    console.error("[loginAction] Exception:", err);
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

  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    const authUserId = authData.user?.id;
    if (!authUserId) {
      return { success: false, error: "Không thể tạo tài khoản xác thực." };
    }

    // Insert or update in `users`
    const [dbUser] = await db
      .insert(users)
      .values({
        id: authUserId,
        email,
        fullName,
        role,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          fullName,
          role,
          updatedAt: new Date(),
        },
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

    revalidatePath("/", "layout");
    return {
      success: true,
      role,
      userId: dbUser.id,
    };
  } catch (err: any) {
    console.error("[signupAction] Exception:", err);
    return { success: false, error: err.message || "Lỗi máy chủ khi đăng ký." };
  }
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) return null;

    const [dbUser] = await db.select().from(users).where(eq(users.email, user.email));
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
