import type { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { users } from '@urc-falke/shared/db';
import { verifyAccessToken, type JWTPayload } from '../lib/jwt.js';
import { eq } from 'drizzle-orm';

// ============================================================================
// AUTH MIDDLEWARE (JWT Cookie Authentication)
// ============================================================================
//
// ARCHITECTURE NOTE: Two-Track Onboarding System
// - Track A (pre-seeded members): may have must_change_password=true
// - Track B (new registrations): always have must_change_password=false
//
// CRITICAL: requireAuth MUST check must_change_password flag in DB
// - If true, return 403 with redirect to /onboard-existing/set-password
// - Frontend intercepts this and redirects user
//
// SECURITY NOTES:
// - JWT stored in HttpOnly cookie (not accessible to JavaScript)
// - Cookie name: accessToken
// - SameSite=lax for PWA compatibility
// - 15-minute expiry (stateless, no refresh token in v1)
//
// ============================================================================

/**
 * Extended request user information
 */
export interface AuthenticatedUser extends JWTPayload {
  mustChangePassword: boolean;
  onboardingStatus: string;
}

/**
 * Express Request type extension for authenticated requests
 */
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Middleware that requires a valid JWT token in the accessToken cookie.
 *
 * CRITICAL: Also checks must_change_password flag in the database.
 * If true, returns 403 with redirect instruction for Track A users.
 *
 * @throws 401 Unauthorized - if no token, invalid token, or user not found
 * @throws 403 Forbidden - if user must change password (Track A onboarding)
 *
 * @example
 * router.get('/protected', requireAuth, (req, res) => {
 *   console.log(req.user.userId); // 123
 * });
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // 1. Get token from cookie
    const token = req.cookies?.accessToken;

    if (!token) {
      res.status(401).json({
        type: 'https://urc-falke.app/errors/unauthorized',
        title: 'Nicht autorisiert',
        status: 401,
        detail: 'Bitte melde dich an.'
      });
      return;
    }

    // 2. Verify JWT token
    const payload = await verifyAccessToken(token);

    // 3. CRITICAL: Fetch user from DB to check must_change_password flag
    // This is required for Two-Track Onboarding compliance
    const [dbUser] = await db.select({
      must_change_password: users.must_change_password,
      onboarding_status: users.onboarding_status
    }).from(users).where(eq(users.id, payload.userId)).limit(1);

    if (!dbUser) {
      res.status(401).json({
        type: 'https://urc-falke.app/errors/unauthorized',
        title: 'Nicht autorisiert',
        status: 401,
        detail: 'Benutzer nicht gefunden.'
      });
      return;
    }

    // 4. CRITICAL: Block access if password change required (Track A users)
    if (dbUser.must_change_password) {
      res.status(403).json({
        type: 'https://urc-falke.app/errors/password-change-required',
        title: 'Passwortänderung erforderlich',
        status: 403,
        detail: 'Bitte ändere zuerst dein Passwort.',
        redirectTo: '/onboard-existing/set-password'
      });
      return;
    }

    // 5. Attach user info to request
    req.user = {
      ...payload,
      mustChangePassword: dbUser.must_change_password ?? false,
      onboardingStatus: dbUser.onboarding_status ?? 'completed'
    };

    next();
  } catch (error) {
    // Token verification failed (expired, malformed, etc.)
    res.status(401).json({
      type: 'https://urc-falke.app/errors/unauthorized',
      title: 'Nicht autorisiert',
      status: 401,
      detail: 'Sitzung abgelaufen. Bitte erneut anmelden.'
    });
  }
}

/**
 * Middleware that optionally authenticates a request.
 *
 * - If valid token present: attaches user to req.user
 * - If no token or invalid token: continues without error (req.user = undefined)
 *
 * Use this for routes that have different behavior for authenticated vs anonymous users.
 *
 * @example
 * router.get('/events', optionalAuth, (req, res) => {
 *   if (req.user) {
 *     // Show personalized content
 *   } else {
 *     // Show public content
 *   }
 * });
 */
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      // No token, continue without authentication
      next();
      return;
    }

    // Try to verify token
    const payload = await verifyAccessToken(token);

    // Fetch user from DB for complete information
    const [dbUser] = await db.select({
      must_change_password: users.must_change_password,
      onboarding_status: users.onboarding_status
    }).from(users).where(eq(users.id, payload.userId)).limit(1);

    if (dbUser) {
      req.user = {
        ...payload,
        mustChangePassword: dbUser.must_change_password ?? false,
        onboardingStatus: dbUser.onboarding_status ?? 'completed'
      };
    }

    next();
  } catch (error) {
    // Token invalid, continue without authentication
    next();
  }
}
