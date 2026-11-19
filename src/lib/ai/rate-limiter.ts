interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * In-memory sliding window rate limiter
 * @param key Client IP or session identifier
 * @param limit Max requests allowed in the window
 * @param windowMs Time window in milliseconds (default 60 seconds)
 */
export function checkRateLimit(key: string, limit = 10, windowMs = 60000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key) || { timestamps: [] };

  // Filter timestamps within current window
  const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (validTimestamps.length >= limit) {
    return { allowed: false, remaining: 0 };
  }

  validTimestamps.push(now);
  rateLimitStore.set(key, { timestamps: validTimestamps });

  // Cleanup old keys occasionally
  if (rateLimitStore.size > 5000) {
    rateLimitStore.forEach((v, k) => {
      if (v.timestamps.length === 0 || now - v.timestamps[v.timestamps.length - 1] > windowMs) {
        rateLimitStore.delete(k);
      }
    });
  }

  return { allowed: true, remaining: limit - validTimestamps.length };
}
