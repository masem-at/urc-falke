import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setPassword, completeProfile } from './user.service';
import type { SetPasswordInput, CompleteProfileInput } from '@urc-falke/shared';
import * as passwordModule from '../lib/password';
import * as dbModule from '../db/connection';

// ============================================================================
// SET PASSWORD SERVICE TESTS (Track A: First password after QR scan)
// ============================================================================

describe('User Service', () => {
  describe('setPassword', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should successfully set password for pre-seeded user', async () => {
      const userId = 42;
      const input: SetPasswordInput = {
        password: 'NewSecurePass123'
      };

      // Mock: Pre-seeded user found with must_change_password=true
      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 42,
          email: 'preseeded@example.com',
          password_hash: '$2b$12$oldHash',
          first_name: 'Max',
          last_name: 'Mustermann',
          role: 'member',
          onboarding_status: 'pre_seeded',
          onboarding_token: 'old-token',
          onboarding_token_expires: new Date(),
          must_change_password: true,
          is_founding_member: true
        }])
      };

      // Mock: Update returns updated user
      const mockUpdate = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{
          id: 42,
          email: 'preseeded@example.com',
          password_hash: '$2b$12$newHashedPassword',
          first_name: 'Max',
          last_name: 'Mustermann',
          role: 'member',
          onboarding_status: 'password_changed',
          onboarding_token: null,
          onboarding_token_expires: null,
          must_change_password: false,
          is_founding_member: true,
          updated_at: new Date()
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);
      vi.spyOn(dbModule.db, 'update').mockReturnValue(mockUpdate as any);
      vi.spyOn(passwordModule, 'hashPassword').mockResolvedValue('$2b$12$newHashedPassword');

      const result = await setPassword(userId, input);

      // Verify password was hashed
      expect(passwordModule.hashPassword).toHaveBeenCalledWith('NewSecurePass123');

      // Verify result
      expect(result.user.id).toBe(42);
      expect(result.user.onboarding_status).toBe('password_changed');
      expect(result.user.must_change_password).toBe(false);
      expect(result.user.onboarding_token).toBeNull();
      expect(result.redirectTo).toBe('/onboard-existing/complete-profile');

      // SECURITY: password_hash should NOT be in response
      expect((result.user as any).password_hash).toBeUndefined();
    });

    it('should throw 404 when user not found', async () => {
      const userId = 999;
      const input: SetPasswordInput = {
        password: 'NewSecurePass123'
      };

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);

      await expect(setPassword(userId, input)).rejects.toMatchObject({
        status: 404,
        title: 'Benutzer nicht gefunden',
        type: 'https://urc-falke.app/errors/user-not-found'
      });
    });

    it('should throw 409 when password already set (must_change_password=false)', async () => {
      const userId = 42;
      const input: SetPasswordInput = {
        password: 'NewSecurePass123'
      };

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 42,
          email: 'user@example.com',
          must_change_password: false // Already changed
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);

      await expect(setPassword(userId, input)).rejects.toMatchObject({
        status: 409,
        title: 'Passwort bereits gesetzt',
        type: 'https://urc-falke.app/errors/password-already-set'
      });
    });

    it('should clear onboarding token after password set (single-use)', async () => {
      const userId = 42;
      const input: SetPasswordInput = {
        password: 'NewSecurePass123'
      };

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 42,
          email: 'preseeded@example.com',
          must_change_password: true,
          onboarding_token: 'active-token'
        }])
      };

      const mockUpdate = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{
          id: 42,
          onboarding_token: null,
          onboarding_token_expires: null,
          must_change_password: false,
          onboarding_status: 'password_changed'
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);
      vi.spyOn(dbModule.db, 'update').mockReturnValue(mockUpdate as any);
      vi.spyOn(passwordModule, 'hashPassword').mockResolvedValue('$2b$12$hash');

      const result = await setPassword(userId, input);

      // SECURITY: Token should be cleared
      expect(result.user.onboarding_token).toBeNull();
      expect(result.user.onboarding_token_expires).toBeNull();
    });

    it('should never return password_hash in response', async () => {
      const userId = 42;
      const input: SetPasswordInput = {
        password: 'NewSecurePass123'
      };

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 42,
          must_change_password: true
        }])
      };

      const mockUpdate = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{
          id: 42,
          password_hash: '$2b$12$verySecretHash', // Should be removed
          onboarding_status: 'password_changed',
          must_change_password: false
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);
      vi.spyOn(dbModule.db, 'update').mockReturnValue(mockUpdate as any);
      vi.spyOn(passwordModule, 'hashPassword').mockResolvedValue('$2b$12$hash');

      const result = await setPassword(userId, input);

      // SECURITY CHECK: password_hash should NOT be in response
      expect((result.user as any).password_hash).toBeUndefined();
      expect(Object.keys(result.user)).not.toContain('password_hash');
    });
  });

  // ============================================================================
  // COMPLETE PROFILE SERVICE TESTS (Track A: Finalize onboarding)
  // ============================================================================

  describe('completeProfile', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should successfully complete profile with all fields', async () => {
      const userId = 42;
      const input: CompleteProfileInput = {
        firstName: 'Maximilian',
        lastName: 'Mustermann'
      };

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 42,
          email: 'user@example.com',
          first_name: 'Max',
          last_name: 'Muster',
          onboarding_status: 'password_changed'
        }])
      };

      const mockUpdate = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{
          id: 42,
          email: 'user@example.com',
          first_name: 'Maximilian',
          last_name: 'Mustermann',
          onboarding_status: 'completed',
          password_hash: '$2b$12$hash'
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);
      vi.spyOn(dbModule.db, 'update').mockReturnValue(mockUpdate as any);

      const result = await completeProfile(userId, input);

      expect(result.user.first_name).toBe('Maximilian');
      expect(result.user.last_name).toBe('Mustermann');
      expect(result.user.onboarding_status).toBe('completed');
      expect(result.showConfetti).toBe(true);
    });

    it('should complete profile with empty input (no changes)', async () => {
      const userId = 42;
      const input: CompleteProfileInput = {};

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 42,
          email: 'user@example.com',
          onboarding_status: 'password_changed'
        }])
      };

      const mockUpdate = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{
          id: 42,
          email: 'user@example.com',
          onboarding_status: 'completed'
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);
      vi.spyOn(dbModule.db, 'update').mockReturnValue(mockUpdate as any);

      const result = await completeProfile(userId, input);

      expect(result.user.onboarding_status).toBe('completed');
      expect(result.showConfetti).toBe(true);
    });

    it('should throw 404 when user not found', async () => {
      const userId = 999;
      const input: CompleteProfileInput = {};

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);

      await expect(completeProfile(userId, input)).rejects.toMatchObject({
        status: 404,
        title: 'Benutzer nicht gefunden',
        type: 'https://urc-falke.app/errors/user-not-found'
      });
    });

    it('should always return showConfetti: true', async () => {
      const userId = 42;
      const input: CompleteProfileInput = {};

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 42,
          onboarding_status: 'password_changed'
        }])
      };

      const mockUpdate = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{
          id: 42,
          onboarding_status: 'completed'
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);
      vi.spyOn(dbModule.db, 'update').mockReturnValue(mockUpdate as any);

      const result = await completeProfile(userId, input);

      expect(result.showConfetti).toBe(true);
    });

    it('should never return password_hash in response', async () => {
      const userId = 42;
      const input: CompleteProfileInput = {};

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 42,
          onboarding_status: 'password_changed'
        }])
      };

      const mockUpdate = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{
          id: 42,
          password_hash: '$2b$12$verySecretHash', // Should be removed
          onboarding_status: 'completed'
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);
      vi.spyOn(dbModule.db, 'update').mockReturnValue(mockUpdate as any);

      const result = await completeProfile(userId, input);

      // SECURITY CHECK: password_hash should NOT be in response
      expect((result.user as any).password_hash).toBeUndefined();
      expect(Object.keys(result.user)).not.toContain('password_hash');
    });
  });
});
