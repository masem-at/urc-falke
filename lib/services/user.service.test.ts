import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { SetPasswordInput, CompleteProfileInput, UpdateProfileInput } from '@/lib/shared';
import * as passwordModule from '../password';

// Mock the db module BEFORE importing the service
vi.mock('../db/connection', () => {
  const mockDb = {
    select: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  return { db: mockDb };
});

// Mock @vercel/blob
vi.mock('@vercel/blob', () => ({
  del: vi.fn(),
}));

// Import after mocking
import { setPassword, completeProfile, updateProfile, deleteUserAccount } from './user.service';
import { db } from '../db/connection';
import { del as blobDel } from '@vercel/blob';

// ============================================================================
// SET PASSWORD SERVICE TESTS (Track A: First password after QR scan)
// ============================================================================

// Helper to create chainable mock for db.select()
const createSelectMock = (result: any[]) => ({
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  limit: vi.fn().mockResolvedValue(result),
});

// Helper to create chainable mock for db.update()
const createUpdateMock = (result: any[]) => ({
  set: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  returning: vi.fn().mockResolvedValue(result),
});

// Helper to create chainable mock for db.delete()
const createDeleteMock = () => ({
  where: vi.fn().mockResolvedValue(undefined),
});

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
      const mockSelect = createSelectMock([{
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
      }]);

      // Mock: Update returns updated user
      const mockUpdate = createUpdateMock([{
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
      }]);

      vi.mocked(db.select).mockReturnValue(mockSelect as any);
      vi.mocked(db.update).mockReturnValue(mockUpdate as any);
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

      const mockSelect = createSelectMock([]);
      vi.mocked(db.select).mockReturnValue(mockSelect as any);

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

      const mockSelect = createSelectMock([{
        id: 42,
        email: 'user@example.com',
        must_change_password: false // Already changed
      }]);

      vi.mocked(db.select).mockReturnValue(mockSelect as any);

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

      const mockSelect = createSelectMock([{
        id: 42,
        email: 'preseeded@example.com',
        must_change_password: true,
        onboarding_token: 'active-token'
      }]);

      const mockUpdate = createUpdateMock([{
        id: 42,
        onboarding_token: null,
        onboarding_token_expires: null,
        must_change_password: false,
        onboarding_status: 'password_changed'
      }]);

      vi.mocked(db.select).mockReturnValue(mockSelect as any);
      vi.mocked(db.update).mockReturnValue(mockUpdate as any);
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

      const mockSelect = createSelectMock([{
        id: 42,
        must_change_password: true
      }]);

      const mockUpdate = createUpdateMock([{
        id: 42,
        password_hash: '$2b$12$verySecretHash', // Should be removed
        onboarding_status: 'password_changed',
        must_change_password: false
      }]);

      vi.mocked(db.select).mockReturnValue(mockSelect as any);
      vi.mocked(db.update).mockReturnValue(mockUpdate as any);
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

      const mockSelect = createSelectMock([{
        id: 42,
        email: 'user@example.com',
        first_name: 'Max',
        last_name: 'Muster',
        onboarding_status: 'password_changed'
      }]);

      const mockUpdate = createUpdateMock([{
        id: 42,
        email: 'user@example.com',
        first_name: 'Maximilian',
        last_name: 'Mustermann',
        onboarding_status: 'completed',
        password_hash: '$2b$12$hash'
      }]);

      vi.mocked(db.select).mockReturnValue(mockSelect as any);
      vi.mocked(db.update).mockReturnValue(mockUpdate as any);

      const result = await completeProfile(userId, input);

      expect(result.user.first_name).toBe('Maximilian');
      expect(result.user.last_name).toBe('Mustermann');
      expect(result.user.onboarding_status).toBe('completed');
      expect(result.showConfetti).toBe(true);
    });

    it('should complete profile with empty input (no changes)', async () => {
      const userId = 42;
      const input: CompleteProfileInput = {};

      const mockSelect = createSelectMock([{
        id: 42,
        email: 'user@example.com',
        onboarding_status: 'password_changed'
      }]);

      const mockUpdate = createUpdateMock([{
        id: 42,
        email: 'user@example.com',
        onboarding_status: 'completed'
      }]);

      vi.mocked(db.select).mockReturnValue(mockSelect as any);
      vi.mocked(db.update).mockReturnValue(mockUpdate as any);

      const result = await completeProfile(userId, input);

      expect(result.user.onboarding_status).toBe('completed');
      expect(result.showConfetti).toBe(true);
    });

    it('should throw 404 when user not found', async () => {
      const userId = 999;
      const input: CompleteProfileInput = {};

      const mockSelect = createSelectMock([]);
      vi.mocked(db.select).mockReturnValue(mockSelect as any);

      await expect(completeProfile(userId, input)).rejects.toMatchObject({
        status: 404,
        title: 'Benutzer nicht gefunden',
        type: 'https://urc-falke.app/errors/user-not-found'
      });
    });

    it('should always return showConfetti: true', async () => {
      const userId = 42;
      const input: CompleteProfileInput = {};

      const mockSelect = createSelectMock([{
        id: 42,
        onboarding_status: 'password_changed'
      }]);

      const mockUpdate = createUpdateMock([{
        id: 42,
        onboarding_status: 'completed'
      }]);

      vi.mocked(db.select).mockReturnValue(mockSelect as any);
      vi.mocked(db.update).mockReturnValue(mockUpdate as any);

      const result = await completeProfile(userId, input);

      expect(result.showConfetti).toBe(true);
    });

    it('should never return password_hash in response', async () => {
      const userId = 42;
      const input: CompleteProfileInput = {};

      const mockSelect = createSelectMock([{
        id: 42,
        onboarding_status: 'password_changed'
      }]);

      const mockUpdate = createUpdateMock([{
        id: 42,
        password_hash: '$2b$12$verySecretHash', // Should be removed
        onboarding_status: 'completed'
      }]);

      vi.mocked(db.select).mockReturnValue(mockSelect as any);
      vi.mocked(db.update).mockReturnValue(mockUpdate as any);

      const result = await completeProfile(userId, input);

      // SECURITY CHECK: password_hash should NOT be in response
      expect((result.user as any).password_hash).toBeUndefined();
      expect(Object.keys(result.user)).not.toContain('password_hash');
    });
  });

  // ============================================================================
  // UPDATE PROFILE SERVICE TESTS (Story 1.6: Profile Management)
  // ============================================================================

  describe('updateProfile', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should successfully update all profile fields', async () => {
      const userId = 42;
      const input: UpdateProfileInput = {
        firstName: 'Max',
        lastName: 'Mustermann',
        nickname: 'Maxi'
      };

      const mockSelect = createSelectMock([{
        id: 42,
        email: 'user@example.com',
        first_name: 'Old',
        last_name: 'Name',
        nickname: null
      }]);

      const mockUpdate = createUpdateMock([{
        id: 42,
        email: 'user@example.com',
        first_name: 'Max',
        last_name: 'Mustermann',
        nickname: 'Maxi',
        password_hash: '$2b$12$hash',
        updated_at: new Date()
      }]);

      vi.mocked(db.select).mockReturnValue(mockSelect as any);
      vi.mocked(db.update).mockReturnValue(mockUpdate as any);

      const result = await updateProfile(userId, input);

      expect(result.first_name).toBe('Max');
      expect(result.last_name).toBe('Mustermann');
      expect(result.nickname).toBe('Maxi');
    });

    it('should update only provided fields (partial update)', async () => {
      const userId = 42;
      const input: UpdateProfileInput = {
        firstName: 'Updated'
        // lastName and nickname not provided
      };

      const mockSelect = createSelectMock([{
        id: 42,
        email: 'user@example.com',
        first_name: 'Original',
        last_name: 'LastName',
        nickname: 'Nick'
      }]);

      const mockUpdate = createUpdateMock([{
        id: 42,
        email: 'user@example.com',
        first_name: 'Updated',
        last_name: 'LastName', // Unchanged
        nickname: 'Nick', // Unchanged
        password_hash: '$2b$12$hash'
      }]);

      vi.mocked(db.select).mockReturnValue(mockSelect as any);
      vi.mocked(db.update).mockReturnValue(mockUpdate as any);

      const result = await updateProfile(userId, input);

      expect(result.first_name).toBe('Updated');
      expect(result.last_name).toBe('LastName');
      expect(result.nickname).toBe('Nick');
    });

    it('should throw 404 when user not found', async () => {
      const userId = 999;
      const input: UpdateProfileInput = { firstName: 'Test' };

      const mockSelect = createSelectMock([]);
      vi.mocked(db.select).mockReturnValue(mockSelect as any);

      await expect(updateProfile(userId, input)).rejects.toMatchObject({
        status: 404,
        title: 'Benutzer nicht gefunden',
        type: 'https://urc-falke.app/errors/user-not-found'
      });
    });

    it('should never return password_hash in response', async () => {
      const userId = 42;
      const input: UpdateProfileInput = { firstName: 'Test' };

      const mockSelect = createSelectMock([{
        id: 42,
        email: 'user@example.com'
      }]);

      const mockUpdate = createUpdateMock([{
        id: 42,
        email: 'user@example.com',
        first_name: 'Test',
        password_hash: '$2b$12$verySecretHash' // Should be removed!
      }]);

      vi.mocked(db.select).mockReturnValue(mockSelect as any);
      vi.mocked(db.update).mockReturnValue(mockUpdate as any);

      const result = await updateProfile(userId, input);

      // SECURITY CHECK: password_hash should NOT be in response
      expect((result as any).password_hash).toBeUndefined();
      expect(Object.keys(result)).not.toContain('password_hash');
    });

    it('should update timestamp on every update', async () => {
      const userId = 42;
      const input: UpdateProfileInput = { nickname: 'NewNick' };

      const mockSelect = createSelectMock([{
        id: 42,
        email: 'user@example.com'
      }]);

      const updatedAt = new Date();
      const mockUpdate = createUpdateMock([{
        id: 42,
        email: 'user@example.com',
        nickname: 'NewNick',
        updated_at: updatedAt
      }]);

      vi.mocked(db.select).mockReturnValue(mockSelect as any);
      vi.mocked(db.update).mockReturnValue(mockUpdate as any);

      const result = await updateProfile(userId, input);

      expect(result.updated_at).toEqual(updatedAt);
    });
  });

  // ============================================================================
  // DELETE USER ACCOUNT SERVICE TESTS (Story 1.8: DSGVO Account Deletion)
  // ============================================================================

  describe('deleteUserAccount', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should successfully delete user account', async () => {
      const userId = 42;

      const mockSelect = createSelectMock([{
        id: 42,
        profile_image_url: null
      }]);

      const mockDelete = createDeleteMock();

      vi.mocked(db.select).mockReturnValue(mockSelect as any);
      vi.mocked(db.delete).mockReturnValue(mockDelete as any);

      const result = await deleteUserAccount(userId);

      expect(result.success).toBe(true);
      expect(db.delete).toHaveBeenCalled();
    });

    it('should delete profile image from blob storage if exists', async () => {
      const userId = 42;
      const imageUrl = 'https://blob.vercel.app/profile-image-123.jpg';

      const mockSelect = createSelectMock([{
        id: 42,
        profile_image_url: imageUrl
      }]);

      const mockDelete = createDeleteMock();

      vi.mocked(db.select).mockReturnValue(mockSelect as any);
      vi.mocked(db.delete).mockReturnValue(mockDelete as any);
      vi.mocked(blobDel).mockResolvedValue(undefined);

      const result = await deleteUserAccount(userId);

      expect(result.success).toBe(true);
      expect(blobDel).toHaveBeenCalledWith(imageUrl);
      expect(db.delete).toHaveBeenCalled();
    });

    it('should continue deleting user even if profile image deletion fails', async () => {
      const userId = 42;
      const imageUrl = 'https://blob.vercel.app/profile-image-123.jpg';

      const mockSelect = createSelectMock([{
        id: 42,
        profile_image_url: imageUrl
      }]);

      const mockDelete = createDeleteMock();

      vi.mocked(db.select).mockReturnValue(mockSelect as any);
      vi.mocked(db.delete).mockReturnValue(mockDelete as any);
      // Simulate blob deletion failure
      vi.mocked(blobDel).mockRejectedValue(new Error('Blob deletion failed'));

      // Should NOT throw, user deletion should continue
      const result = await deleteUserAccount(userId);

      expect(result.success).toBe(true);
      expect(blobDel).toHaveBeenCalledWith(imageUrl);
      expect(db.delete).toHaveBeenCalled();
    });

    it('should not call blob delete if no profile image', async () => {
      const userId = 42;

      const mockSelect = createSelectMock([{
        id: 42,
        profile_image_url: null
      }]);

      const mockDelete = createDeleteMock();

      vi.mocked(db.select).mockReturnValue(mockSelect as any);
      vi.mocked(db.delete).mockReturnValue(mockDelete as any);

      await deleteUserAccount(userId);

      expect(blobDel).not.toHaveBeenCalled();
      expect(db.delete).toHaveBeenCalled();
    });

    it('should throw 404 when user not found', async () => {
      const userId = 999;

      const mockSelect = createSelectMock([]);
      vi.mocked(db.select).mockReturnValue(mockSelect as any);

      await expect(deleteUserAccount(userId)).rejects.toMatchObject({
        status: 404,
        title: 'Benutzer nicht gefunden',
        type: 'https://urc-falke.app/errors/user-not-found'
      });

      expect(db.delete).not.toHaveBeenCalled();
    });
  });
});
