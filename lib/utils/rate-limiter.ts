// ============================================================================
// SIMPLE IN-MEMORY RATE LIMITER
// ============================================================================
//
// MVP implementation using in-memory Map.
// For production at scale, replace with Redis/Upstash rate limiting.
//
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetAt < now) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Number of remaining requests in current window */
  remaining: number;
  /** Timestamp when the rate limit resets */
  resetAt: number;
  /** Number of seconds until reset */
  retryAfter: number;
}

/**
 * Check if a request is rate limited
 *
 * @param key - Unique identifier (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  // No existing entry or window expired - allow and start new window
  if (!entry || entry.resetAt < now) {
    const resetAt = now + config.windowMs;
    rateLimitMap.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt,
      retryAfter: 0
    };
  }

  // Within window - check count
  if (entry.count >= config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfter
    };
  }

  // Within window and under limit - increment and allow
  entry.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
    retryAfter: 0
  };
}

// Pre-configured rate limiters
export const RATE_LIMITS = {
  /** Password reset: 5 requests per 15 minutes per IP */
  PASSWORD_RESET: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000 // 15 minutes
  },
  /** Login: 10 requests per 15 minutes per IP */
  LOGIN: {
    maxRequests: 10,
    windowMs: 15 * 60 * 1000 // 15 minutes
  },
  /** Registration: 3 requests per hour per IP */
  REGISTRATION: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000 // 1 hour
  },
  /** Account deletion: 3 requests per hour per IP (DSGVO critical) */
  ACCOUNT_DELETE: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000 // 1 hour
  }
} as const;
