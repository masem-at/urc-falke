/**
 * Simple in-memory rate limiter for Next.js API routes
 *
 * Note: This is suitable for single-instance deployments.
 * For multi-instance (serverless), use Redis or similar.
 */

interface RateLimitRecord {
  count: number
  resetTime: number
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitRecord>()

// Cleanup old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.resetTime < now) {
        rateLimitStore.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

export interface RateLimitConfig {
  /** Time window in milliseconds */
  windowMs: number
  /** Maximum requests per window */
  max: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
}

/**
 * Check rate limit for a given identifier (usually IP address)
 *
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns RateLimitResult with success status and remaining requests
 *
 * @example
 * const result = checkRateLimit(ip, { windowMs: 60000, max: 5 })
 * if (!result.success) {
 *   return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
 * }
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  // No existing record or window expired
  if (!record || record.resetTime < now) {
    const resetTime = now + config.windowMs
    rateLimitStore.set(identifier, { count: 1, resetTime })
    return {
      success: true,
      remaining: config.max - 1,
      resetTime,
    }
  }

  // Existing record within window
  if (record.count >= config.max) {
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
    }
  }

  // Increment count
  record.count++
  return {
    success: true,
    remaining: config.max - record.count,
    resetTime: record.resetTime,
  }
}

/**
 * Get client IP from Next.js request headers
 *
 * Checks x-forwarded-for header first (for proxies/load balancers),
 * then falls back to x-real-ip, then to a default.
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIp = headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  return 'unknown'
}

// Pre-configured rate limiters
export const USV_VERIFY_RATE_LIMIT: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute (per AC1)
}
