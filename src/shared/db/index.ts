import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as dotenv from "dotenv";

if (!process.env.DATABASE_URL) {
  dotenv.config({ path: ".env.local" });
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL in environment variables.");
}

// Configure robust connection pooling and SSL for cloud deployment
const isProd = process.env.NODE_ENV === "production";
const client = postgres(connectionString, {
  prepare: false,
  max: process.env.DB_MAX_CONNECTIONS ? Number(process.env.DB_MAX_CONNECTIONS) : 10,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: isProd || process.env.DATABASE_SSL === "true" ? "require" : undefined,
});

export const db = drizzle(client, { schema });
export type DB = typeof db;
export * from "./schema";
