// Simple in-memory rate limiter for serverless (per-instance)
// Not perfect across instances but good enough for free tier protection

interface RateBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateBucket>();

// Cleanup old entries periodically
let lastCleanup = Date.now();
function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return; // cleanup every 60s
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

export interface RateLimitConfig {
  windowMs: number;   // time window in ms
  maxRequests: number; // max requests per window
}

export function rateLimit(key: string, config: RateLimitConfig): { allowed: boolean; remaining: number; retryAfterMs: number } {
  cleanup();
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1, retryAfterMs: 0 };
  }

  if (bucket.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count++;
  return { allowed: true, remaining: config.maxRequests - bucket.count, retryAfterMs: 0 };
}

// Rate limit configs per endpoint
export const RATE_LIMITS = {
  // GET messages: 30 req/min per IP (polling every 10s = 6/min, with buffer)
  getMessages: { windowMs: 60_000, maxRequests: 30 },
  // POST messages: 5 per minute per IP (prevent spam)
  postMessage: { windowMs: 60_000, maxRequests: 5 },
  // POST reactions: 20 per minute per IP
  react: { windowMs: 60_000, maxRequests: 20 },
  // Global: 200 req/min total across all IPs (Vercel/Neon protection)
  global: { windowMs: 60_000, maxRequests: 200 },
};
