import { Router } from 'express';
import { validate } from '../middleware/validate.middleware.js';
import { authRateLimiter } from '../middleware/rate-limit.middleware.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { signupSchema, loginSchema, onboardExistingSchema } from '@urc-falke/shared';
import { registerUser, loginUser, onboardExistingUser, type ProblemDetails } from '../services/auth.service.js';
import type { Request, Response, NextFunction } from 'express';

// ============================================================================
// AUTHENTICATION ROUTES (Track A and Track B)
// ============================================================================
//
// ENDPOINTS:
// - POST /api/v1/auth/register         - Register new user (Track B)
// - POST /api/v1/auth/login            - Login existing user (Track A + B)
// - POST /api/v1/auth/logout           - Logout user (clears cookie)
// - GET  /api/v1/auth/me               - Get current authenticated user
// - POST /api/v1/auth/onboard-existing - Token-based auto-login (Track A)
//
// SECURITY:
// - Rate limiting: 10 requests/minute per IP
// - Validation: Zod schema (server-side)
// - JWT: HttpOnly cookie with 15-minute expiry
// - Password: Hashed with bcrypt (12 rounds)
//
// TWO-TRACK ONBOARDING:
// - Login returns mustChangePassword flag
// - If true, frontend redirects to /onboard-existing/set-password
//
// ============================================================================

const router = Router();

/**
 * POST /api/v1/auth/register
 *
 * Register a new user (Track B: New Members)
 *
 * Request Body:
 *   - email: string (valid email format)
 *   - password: string (min 8 chars, uppercase, lowercase, number)
 *   - firstName: string (min 2 chars)
 *   - lastName: string (min 2 chars)
 *   - usvNumber: string (optional)
 *
 * Success Response (201 Created):
 *   {
 *     "id": 123,
 *     "email": "user@example.com",
 *     "first_name": "Max",
 *     "last_name": "Mustermann",
 *     "role": "member",
 *     ...
 *   }
 *   + JWT cookie set in response headers
 *
 * Error Responses:
 *   - 400: Validation error
 *   - 409: Email already exists
 *   - 429: Rate limit exceeded
 *   - 500: Internal server error
 */
router.post(
  '/api/v1/auth/register',
  authRateLimiter, // Apply rate limiting FIRST
  validate(signupSchema), // Then validate request body
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Register user and get JWT token
      const { user, accessToken } = await registerUser(req.body);

      // Set JWT in HttpOnly cookie (SECURITY: NOT in localStorage)
      res.cookie('accessToken', accessToken, {
        httpOnly: true, // Prevents JavaScript access (XSS protection)
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'lax', // CSRF protection
        maxAge: 15 * 60 * 1000 // 15 minutes (matches JWT expiry)
      });

      // Return user object (password_hash excluded by service)
      res.status(201).json(user);
    } catch (error) {
      // Handle ProblemDetails errors from service
      if (error && typeof error === 'object' && 'status' in error) {
        const problemDetails = error as ProblemDetails;
        res.status(problemDetails.status).json(problemDetails);
        return;
      }

      // Unexpected error - pass to error middleware
      next(error);
    }
  }
);

/**
 * POST /api/v1/auth/login
 *
 * Login an existing user (Track A + Track B)
 *
 * Request Body:
 *   - email: string (valid email format)
 *   - password: string
 *
 * Success Response (200 OK):
 *   {
 *     "user": { ... },
 *     "mustChangePassword": boolean
 *   }
 *   + JWT cookie set in response headers
 *
 * CRITICAL: If mustChangePassword is true (Track A users),
 * frontend MUST redirect to /onboard-existing/set-password
 *
 * Error Responses:
 *   - 400: Validation error
 *   - 401: Invalid credentials
 *   - 429: Rate limit exceeded
 *   - 500: Internal server error
 */
router.post(
  '/api/v1/auth/login',
  authRateLimiter,
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, accessToken, mustChangePassword } = await loginUser(req.body);

      // Set JWT in HttpOnly cookie
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      // Return user and mustChangePassword flag
      res.status(200).json({
        user,
        mustChangePassword
      });
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error) {
        const problemDetails = error as ProblemDetails;
        res.status(problemDetails.status).json(problemDetails);
        return;
      }
      next(error);
    }
  }
);

/**
 * POST /api/v1/auth/logout
 *
 * Logout user by clearing the accessToken cookie
 *
 * Success Response (200 OK):
 *   { "message": "Erfolgreich abgemeldet." }
 *
 * Note: This endpoint doesn't require authentication.
 * If no cookie exists, it still returns success.
 */
router.post(
  '/api/v1/auth/logout',
  (_req: Request, res: Response): void => {
    // Clear the accessToken cookie
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.status(200).json({
      message: 'Erfolgreich abgemeldet.'
    });
  }
);

/**
 * GET /api/v1/auth/me
 *
 * Get current authenticated user information
 *
 * Requires: Valid JWT in accessToken cookie
 *
 * Success Response (200 OK):
 *   {
 *     "userId": 123,
 *     "role": "member",
 *     "mustChangePassword": false,
 *     "onboardingStatus": "completed"
 *   }
 *
 * Error Responses:
 *   - 401: Not authenticated
 *   - 403: Must change password (Track A users)
 */
router.get(
  '/api/v1/auth/me',
  requireAuth,
  (req: Request, res: Response): void => {
    // requireAuth already attached user info to req.user
    res.status(200).json(req.user);
  }
);

/**
 * POST /api/v1/auth/onboard-existing
 *
 * Onboard an existing member using their QR code token (Track A)
 *
 * Request Body:
 *   - token: string (onboarding token from QR code)
 *
 * Success Response (200 OK):
 *   {
 *     "user": { ... },
 *     "redirectTo": "/onboard-existing/set-password"
 *   }
 *   + JWT cookie set in response headers
 *
 * CRITICAL: After successful onboard, user MUST be redirected to
 * /onboard-existing/set-password to complete onboarding
 *
 * Error Responses:
 *   - 400: Validation error (token missing)
 *   - 404: Token not found
 *   - 409: Token already used (account already activated)
 *   - 410: Token expired
 *   - 429: Rate limit exceeded
 *   - 500: Internal server error
 */
router.post(
  '/api/v1/auth/onboard-existing',
  authRateLimiter, // Apply rate limiting FIRST
  validate(onboardExistingSchema), // Then validate request body
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, accessToken, redirectTo } = await onboardExistingUser(req.body);

      // Set JWT in HttpOnly cookie (SECURITY: NOT in localStorage)
      res.cookie('accessToken', accessToken, {
        httpOnly: true, // Prevents JavaScript access (XSS protection)
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'lax', // CSRF protection
        maxAge: 15 * 60 * 1000 // 15 minutes (matches JWT expiry)
      });

      // Return user and redirect path
      res.status(200).json({
        user,
        redirectTo
      });
    } catch (error) {
      // Handle ProblemDetails errors from service
      if (error && typeof error === 'object' && 'status' in error) {
        const problemDetails = error as ProblemDetails;
        res.status(problemDetails.status).json(problemDetails);
        return;
      }

      // Unexpected error - pass to error middleware
      next(error);
    }
  }
);

export default router;
