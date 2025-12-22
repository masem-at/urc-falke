import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { requireAuth, optionalAuth } from './auth.middleware';
import * as jwtModule from '../lib/jwt';
import * as dbModule from '../db/connection';

// ============================================================================
// AUTH MIDDLEWARE TESTS
// ============================================================================
//
// Tests cover:
// - Valid token passes with must_change_password: false
// - Missing token returns 401
// - Invalid token returns 401
// - Expired token returns 401
// - User payload is attached to request
// - CRITICAL: must_change_password: true returns 403 with redirectTo
// - Deleted user returns 401
// - optionalAuth continues without error for invalid/missing tokens
//
// ============================================================================

// Mock request factory
function createMockRequest(cookies: Record<string, string> = {}): Partial<Request> {
  return {
    cookies
  };
}

// Mock response factory
function createMockResponse(): Partial<Response> {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

// Mock next function
const createMockNext = (): NextFunction => vi.fn();

describe('Auth Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('requireAuth', () => {
    it('should pass with valid token and must_change_password: false', async () => {
      const req = createMockRequest({ accessToken: 'valid.jwt.token' });
      const res = createMockResponse();
      const next = createMockNext();

      // Mock JWT verification
      vi.spyOn(jwtModule, 'verifyAccessToken').mockResolvedValue({
        userId: 1,
        role: 'member'
      });

      // Mock database lookup
      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          must_change_password: false,
          onboarding_status: 'completed'
        }])
      };
      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);

      await requireAuth(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user?.userId).toBe(1);
      expect(req.user?.role).toBe('member');
    });

    it('should return 401 when no token is present', async () => {
      const req = createMockRequest({});
      const res = createMockResponse();
      const next = createMockNext();

      await requireAuth(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 401,
          title: 'Nicht autorisiert'
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 for invalid token', async () => {
      const req = createMockRequest({ accessToken: 'invalid.token' });
      const res = createMockResponse();
      const next = createMockNext();

      // Mock JWT verification failure
      vi.spyOn(jwtModule, 'verifyAccessToken').mockRejectedValue(new Error('Invalid token'));

      await requireAuth(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 401,
          detail: 'Sitzung abgelaufen. Bitte erneut anmelden.'
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 for expired token', async () => {
      const req = createMockRequest({ accessToken: 'expired.jwt.token' });
      const res = createMockResponse();
      const next = createMockNext();

      // Mock JWT verification failure (expired)
      const expiredError = new Error('Token expired');
      expiredError.name = 'JWTExpired';
      vi.spyOn(jwtModule, 'verifyAccessToken').mockRejectedValue(expiredError);

      await requireAuth(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should attach user payload to request', async () => {
      const req = createMockRequest({ accessToken: 'valid.jwt.token' });
      const res = createMockResponse();
      const next = createMockNext();

      vi.spyOn(jwtModule, 'verifyAccessToken').mockResolvedValue({
        userId: 42,
        role: 'admin'
      });

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          must_change_password: false,
          onboarding_status: 'completed'
        }])
      };
      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);

      await requireAuth(req as Request, res as Response, next);

      expect(req.user).toEqual({
        userId: 42,
        role: 'admin',
        mustChangePassword: false,
        onboardingStatus: 'completed'
      });
    });

    it('should return 403 with redirectTo when must_change_password is true (Track A)', async () => {
      const req = createMockRequest({ accessToken: 'valid.jwt.token' });
      const res = createMockResponse();
      const next = createMockNext();

      vi.spyOn(jwtModule, 'verifyAccessToken').mockResolvedValue({
        userId: 99,
        role: 'member'
      });

      // Pre-seeded user with must_change_password: true
      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          must_change_password: true,
          onboarding_status: 'pending_password'
        }])
      };
      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);

      await requireAuth(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 403,
          type: 'https://urc-falke.app/errors/password-change-required',
          title: 'Passwortänderung erforderlich',
          detail: 'Bitte ändere zuerst dein Passwort.',
          redirectTo: '/onboard-existing/set-password'
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 for deleted user (user not found in DB)', async () => {
      const req = createMockRequest({ accessToken: 'valid.jwt.token' });
      const res = createMockResponse();
      const next = createMockNext();

      vi.spyOn(jwtModule, 'verifyAccessToken').mockResolvedValue({
        userId: 999,
        role: 'member'
      });

      // User not found in database
      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([])
      };
      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);

      await requireAuth(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 401,
          detail: 'Benutzer nicht gefunden.'
        })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('should continue without error when no token is present', async () => {
      const req = createMockRequest({});
      const res = createMockResponse();
      const next = createMockNext();

      await optionalAuth(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(req.user).toBeUndefined();
    });

    it('should attach user when valid token is present', async () => {
      const req = createMockRequest({ accessToken: 'valid.jwt.token' });
      const res = createMockResponse();
      const next = createMockNext();

      vi.spyOn(jwtModule, 'verifyAccessToken').mockResolvedValue({
        userId: 1,
        role: 'member'
      });

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          must_change_password: false,
          onboarding_status: 'completed'
        }])
      };
      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);

      await optionalAuth(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user?.userId).toBe(1);
    });

    it('should continue without error when token is invalid', async () => {
      const req = createMockRequest({ accessToken: 'invalid.token' });
      const res = createMockResponse();
      const next = createMockNext();

      vi.spyOn(jwtModule, 'verifyAccessToken').mockRejectedValue(new Error('Invalid token'));

      await optionalAuth(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(req.user).toBeUndefined();
    });

    it('should NOT block access for must_change_password users', async () => {
      // optionalAuth should NOT check must_change_password
      const req = createMockRequest({ accessToken: 'valid.jwt.token' });
      const res = createMockResponse();
      const next = createMockNext();

      vi.spyOn(jwtModule, 'verifyAccessToken').mockResolvedValue({
        userId: 99,
        role: 'member'
      });

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          must_change_password: true, // Even with true, optionalAuth continues
          onboarding_status: 'pending_password'
        }])
      };
      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);

      await optionalAuth(req as Request, res as Response, next);

      // Should continue, not return 403
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalledWith(403);
      expect(req.user).toBeDefined();
    });
  });
});
