import { NextResponse } from "next/server";
import { db } from "@/shared/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  try {
    // Ping PostgreSQL connection pool
    await db.execute(sql`SELECT 1`);
    const latencyMs = Date.now() - start;

    return NextResponse.json(
      {
        status: "healthy",
        database: "connected",
        latencyMs,
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    const latencyMs = Date.now() - start;
    console.error("[Health Check Probe Failed]:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error: error.message || "Database connection failure",
        latencyMs,
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}
