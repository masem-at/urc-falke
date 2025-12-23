import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  checkRateLimit,
  getClientIp,
  USV_VERIFY_RATE_LIMIT,
  type RateLimitConfig,
} from './rate-limit'

// ============================================================================
// RATE LIMITING TESTS
// ============================================================================
// Tests for Next.js API route rate limiting (Story 1.5, AC1)
//
// Requirements:
// - 5 requests per minute per IP for USV verify endpoint
// - Returns success: false when limit exceeded
// - Tracks remaining requests
// - Properly extracts client IP from headers
// ============================================================================

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Clear any rate limit state between tests by using unique identifiers
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('checkRateLimit', () => {
    const testConfig: RateLimitConfig = {
      windowMs: 60000, // 1 minute
      max: 5,
    }

    it('should allow first request', () => {
      const result = checkRateLimit('test-ip-1', testConfig)

      expect(result.success).toBe(true)
      expect(result.remaining).toBe(4) // 5 - 1 = 4 remaining
    })

    it('should track remaining requests correctly', () => {
      const identifier = 'test-ip-2'

      const result1 = checkRateLimit(identifier, testConfig)
      expect(result1.remaining).toBe(4)

      const result2 = checkRateLimit(identifier, testConfig)
      expect(result2.remaining).toBe(3)

      const result3 = checkRateLimit(identifier, testConfig)
      expect(result3.remaining).toBe(2)
    })

    it('should block requests after limit exceeded', () => {
      const identifier = 'test-ip-3'

      // Use up all 5 requests
      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit(identifier, testConfig)
        expect(result.success).toBe(true)
      }

      // 6th request should be blocked
      const blocked = checkRateLimit(identifier, testConfig)
      expect(blocked.success).toBe(false)
      expect(blocked.remaining).toBe(0)
    })

    it('should reset after window expires', () => {
      const identifier = 'test-ip-4'

      // Use up all requests
      for (let i = 0; i < 5; i++) {
        checkRateLimit(identifier, testConfig)
      }

      // Verify blocked
      const blocked = checkRateLimit(identifier, testConfig)
      expect(blocked.success).toBe(false)

      // Advance time past window
      vi.advanceTimersByTime(60001) // Just over 1 minute

      // Should be allowed again
      const afterReset = checkRateLimit(identifier, testConfig)
      expect(afterReset.success).toBe(true)
      expect(afterReset.remaining).toBe(4)
    })

    it('should track different IPs independently', () => {
      // IP 1 uses all requests
      for (let i = 0; i < 5; i++) {
        checkRateLimit('ip-a', testConfig)
      }

      // IP 1 should be blocked
      expect(checkRateLimit('ip-a', testConfig).success).toBe(false)

      // IP 2 should still be allowed
      expect(checkRateLimit('ip-b', testConfig).success).toBe(true)
    })

    it('should return reset time', () => {
      const result = checkRateLimit('test-ip-5', testConfig)

      expect(result.resetTime).toBeGreaterThan(Date.now())
      expect(result.resetTime).toBeLessThanOrEqual(Date.now() + 60000)
    })
  })

  describe('getClientIp', () => {
    it('should extract IP from x-forwarded-for header', () => {
      const headers = new Headers()
      headers.set('x-forwarded-for', '192.168.1.1, 10.0.0.1')

      const ip = getClientIp(headers)
      expect(ip).toBe('192.168.1.1')
    })

    it('should extract IP from x-real-ip header', () => {
      const headers = new Headers()
      headers.set('x-real-ip', '192.168.1.2')

      const ip = getClientIp(headers)
      expect(ip).toBe('192.168.1.2')
    })

    it('should prefer x-forwarded-for over x-real-ip', () => {
      const headers = new Headers()
      headers.set('x-forwarded-for', '192.168.1.1')
      headers.set('x-real-ip', '192.168.1.2')

      const ip = getClientIp(headers)
      expect(ip).toBe('192.168.1.1')
    })

    it('should return unknown when no IP headers present', () => {
      const headers = new Headers()

      const ip = getClientIp(headers)
      expect(ip).toBe('unknown')
    })

    it('should trim whitespace from IP', () => {
      const headers = new Headers()
      headers.set('x-forwarded-for', '  192.168.1.1  , 10.0.0.1')

      const ip = getClientIp(headers)
      expect(ip).toBe('192.168.1.1')
    })
  })

  describe('USV_VERIFY_RATE_LIMIT config', () => {
    it('should have correct window (1 minute)', () => {
      expect(USV_VERIFY_RATE_LIMIT.windowMs).toBe(60000)
    })

    it('should have correct max (5 requests per AC1)', () => {
      expect(USV_VERIFY_RATE_LIMIT.max).toBe(5)
    })
  })
})
