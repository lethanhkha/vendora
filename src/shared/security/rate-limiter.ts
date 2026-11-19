/**
 * In-memory Sliding Window Rate Limiter
 * Protects public endpoints (uploads, webhooks, auth) against spam and DoS attacks.
 */

interface RateLimitRecord {
  timestamps: number[];
}

class InMemoryRateLimiter {
  private store: Map<string, RateLimitRecord> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Periodically sweep expired timestamps every 5 minutes to prevent memory leak
    if (typeof setInterval !== "undefined") {
      this.cleanupInterval = setInterval(() => {
        const now = Date.now();
        for (const [key, record] of this.store.entries()) {
          record.timestamps = record.timestamps.filter((ts) => now - ts < 600000);
          if (record.timestamps.length === 0) {
            this.store.delete(key);
          }
        }
      }, 300000);
      if (this.cleanupInterval && typeof this.cleanupInterval.unref === "function") {
        this.cleanupInterval.unref();
      }
    }
  }

  /**
   * Checks if an identifier exceeds the allowed limit within a window.
   * @param key Identifier (e.g. client IP + endpoint)
   * @param maxRequests Maximum requests permitted
   * @param windowMs Time window in milliseconds (default 60,000ms = 1 min)
   */
  check(
    key: string,
    maxRequests: number,
    windowMs: number = 60000
  ): {
    success: boolean;
    remaining: number;
    resetMs: number;
  } {
    const now = Date.now();
    const windowStart = now - windowMs;

    let record = this.store.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.store.set(key, record);
    }

    // Retain only requests within current sliding window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (record.timestamps.length >= maxRequests) {
      const oldest = record.timestamps[0];
      const resetMs = Math.max(0, oldest + windowMs - now);
      return {
        success: false,
        remaining: 0,
        resetMs,
      };
    }

    record.timestamps.push(now);
    return {
      success: true,
      remaining: maxRequests - record.timestamps.length,
      resetMs: windowMs,
    };
  }
}

export const rateLimiter = new InMemoryRateLimiter();

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
