import { Router } from 'express';
import { validate } from '../middleware/validate.middleware.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { setPasswordSchema, completeProfileSchema } from '@urc-falke/shared';
import { setPassword, completeProfile, type ProblemDetails } from '../services/user.service.js';
import type { Request, Response, NextFunction } from 'express';

// ============================================================================
// USER ROUTES (Profile and Password Management)
// ============================================================================
//
// ENDPOINTS:
// - PUT /api/v1/users/me/set-password     - Set password (Track A onboarding)
// - PUT /api/v1/users/me/complete-profile - Complete profile (Track A onboarding)
//
// SECURITY:
// - All routes require authentication (requireAuth middleware)
// - set-password has special auth exception (allows must_change_password=true)
// - Validation: Zod schema (server-side)
// - Password: Hashed with bcrypt (12 rounds)
//
// ============================================================================

const router = Router();

/**
 * PUT /api/v1/users/me/set-password
 *
 * Set password for Track A user during onboarding
 *
 * Requires: Valid JWT in accessToken cookie (even with must_change_password=true)
 *
 * Request Body:
 *   - password: string (min 8 chars, uppercase, lowercase, number)
 *
 * Success Response (200 OK):
 *   {
 *     "user": { ... },
 *     "redirectTo": "/onboard-existing/complete-profile"
 *   }
 *
 * CRITICAL: After successful password change, user should be redirected to
 * /onboard-existing/complete-profile to finalize onboarding
 *
 * Error Responses:
 *   - 400: Validation error (password requirements)
 *   - 401: Not authenticated
 *   - 404: User not found
 *   - 409: Password already set
 *   - 500: Internal server error
 */
router.put(
  '/api/v1/users/me/set-password',
  requireAuth, // Auth middleware with special exception for this route
  validate(setPasswordSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          type: 'https://urc-falke.app/errors/unauthorized',
          title: 'Nicht authentifiziert',
          status: 401,
          detail: 'Du musst angemeldet sein um dein Passwort zu setzen.'
        });
        return;
      }

      const result = await setPassword(userId, req.body);

      res.status(200).json(result);
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
 * PUT /api/v1/users/me/complete-profile
 *
 * Complete profile for Track A user during onboarding
 *
 * Requires: Valid JWT in accessToken cookie
 *
 * Request Body (all optional):
 *   - firstName: string (min 2 chars)
 *   - lastName: string (min 2 chars)
 *   - profileImageUrl: string (valid URL)
 *
 * Success Response (200 OK):
 *   {
 *     "user": { ... },
 *     "showConfetti": true
 *   }
 *
 * CRITICAL: After successful completion, frontend should show confetti
 * animation (1000ms duration, 50 particles) to celebrate
 *
 * Error Responses:
 *   - 400: Validation error
 *   - 401: Not authenticated
 *   - 403: Must change password first
 *   - 404: User not found
 *   - 500: Internal server error
 */
router.put(
  '/api/v1/users/me/complete-profile',
  requireAuth,
  validate(completeProfileSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          type: 'https://urc-falke.app/errors/unauthorized',
          title: 'Nicht authentifiziert',
          status: 401,
          detail: 'Du musst angemeldet sein um dein Profil zu vervollständigen.'
        });
        return;
      }

      const result = await completeProfile(userId, req.body);

      res.status(200).json(result);
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
