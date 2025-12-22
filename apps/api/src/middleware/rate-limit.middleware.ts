import rateLimit from 'express-rate-limit';

// ============================================================================
// RATE LIMITING MIDDLEWARE (express-rate-limit)
// ============================================================================
//
// SECURITY NOTE: Rate limiting prevents brute force attacks
// - Auth endpoints: 10 requests per minute per IP
// - Protects against credential stuffing, password guessing
// - Returns 429 Too Many Requests when limit exceeded
//
// ARCHITECTURE NOTE: Applied per-endpoint, not globally
// - Different limits for different endpoints (auth vs. general)
// - IP-based limiting (can be enhanced with user-based in future)
//
// ============================================================================

/**
 * Rate limiter for authentication endpoints (login, register)
 *
 * Configuration:
 * - 10 requests per minute per IP address
 * - Returns German error message when limit exceeded
 * - Automatically resets after 1 minute
 *
 * @example
 * router.post('/register', authRateLimiter, validate(signupSchema), handler);
 * router.post('/login', authRateLimiter, validate(loginSchema), handler);
 */
export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 10, // 10 requests per minute
  message: 'Zu viele Anmelde-Versuche. Bitte warte 1 Minute.',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers

  // Custom handler for rate limit exceeded (RFC 7807 format)
  handler: (req, res) => {
    res.status(429).json({
      type: 'https://urc-falke.app/errors/rate-limit-exceeded',
      title: 'Zu viele Anfragen',
      status: 429,
      detail: 'Zu viele Anmelde-Versuche. Bitte warte 1 Minute.',
      instance: req.originalUrl,
      retryAfter: '60 seconds'
    });
  }
});

/**
 * Rate limiter for USV verification endpoint
 *
 * Configuration:
 * - 5 requests per minute per IP address
 * - Stricter than auth limiter to prevent abuse
 * - Returns German error message when limit exceeded
 * - Automatically resets after 1 minute
 *
 * @example
 * router.post('/api/v1/usv/verify', usvVerifyRateLimiter, validate(usvVerifySchema), handler);
 */
export const usvVerifyRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5, // 5 requests per minute
  message: 'Zu viele Anfragen. Bitte versuche es in einer Minute erneut.',
  standardHeaders: true,
  legacyHeaders: false,

  // Custom handler for rate limit exceeded (RFC 7807 format)
  handler: (req, res) => {
    res.status(429).json({
      type: 'https://urc-falke.app/errors/rate-limit-exceeded',
      title: 'Zu viele Anfragen',
      status: 429,
      detail: 'Zu viele Anfragen. Bitte versuche es in einer Minute erneut.',
      instance: req.originalUrl,
      retryAfter: '60 seconds'
    });
  }
});
