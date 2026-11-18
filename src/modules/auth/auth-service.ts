import { db, users } from "@/shared/db";
import { eq } from "drizzle-orm";

export async function getOrCreateUser(email: string, fullName?: string) {
  const [existing] = await db.select().from(users).where(eq(users.email, email));
  if (existing) return existing;

  const [newUser] = await db
    .insert(users)
    .values({
      email,
      fullName: fullName || email.split("@")[0],
      role: "BUYER",
    })
    .returning();

  return newUser;
}

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user || null;
}
