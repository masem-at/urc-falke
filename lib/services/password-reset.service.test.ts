import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the db module BEFORE importing the service
vi.mock('../db/connection', () => {
  const mockDb = {
    select: vi.fn(),
    update: vi.fn(),
  };
  return { db: mockDb };
});

// Mock the password module
vi.mock('../password', () => ({
  hashPassword: vi.fn().mockResolvedValue('hashed_password'),
}));

// Import after mocking
import { requestPasswordReset, validateResetToken, resetPassword } from './password-reset.service';
import { db } from '../db/connection';
import { hashPassword } from '../password';

// Helper to create chainable mock for db.select()
const createSelectMock = (result: unknown[]) => ({
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  limit: vi.fn().mockResolvedValue(result),
});

// Helper to create chainable mock for db.update()
const createUpdateMock = (returningResult: unknown[] = []) => ({
  set: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  returning: vi.fn().mockResolvedValue(returningResult),
});

describe('PasswordResetService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('requestPasswordReset', () => {
    it('should generate token for existing email', async () => {
      const mockUser = { id: 1, email: 'test@example.com', first_name: 'Max' };
      vi.mocked(db.select).mockReturnValue(createSelectMock([mockUser]) as unknown as ReturnType<typeof db.select>);
      vi.mocked(db.update).mockReturnValue(createUpdateMock() as unknown as ReturnType<typeof db.update>);

      const result = await requestPasswordReset({ email: 'test@example.com' });

      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.token?.length).toBe(64); // 32 bytes = 64 hex chars
      expect(result.email).toBe('test@example.com');
      expect(result.firstName).toBe('Max');
    });

    it('should return success for non-existent email (security)', async () => {
      vi.mocked(db.select).mockReturnValue(createSelectMock([]) as unknown as ReturnType<typeof db.select>);

      const result = await requestPasswordReset({ email: 'nonexistent@example.com' });

      expect(result.success).toBe(true);
      expect(result.token).toBeUndefined();
      expect(result.email).toBeUndefined();
    });

    it('should store token with 1 hour expiration', async () => {
      const mockUser = { id: 1, email: 'test@example.com', first_name: 'Max' };
      const updateMock = createUpdateMock();
      vi.mocked(db.select).mockReturnValue(createSelectMock([mockUser]) as unknown as ReturnType<typeof db.select>);
      vi.mocked(db.update).mockReturnValue(updateMock as unknown as ReturnType<typeof db.update>);

      const before = Date.now();
      await requestPasswordReset({ email: 'test@example.com' });
      const after = Date.now();

      // Verify update was called with set containing expiration
      expect(vi.mocked(db.update)).toHaveBeenCalled();
      const setCall = updateMock.set.mock.calls[0][0];
      expect(setCall.password_reset_token).toBeDefined();
      expect(setCall.password_reset_token_expires).toBeDefined();

      // Check expiration is approximately 1 hour from now
      const expiresAt = new Date(setCall.password_reset_token_expires).getTime();
      const expectedExpiry = before + 60 * 60 * 1000; // 1 hour
      expect(expiresAt).toBeGreaterThanOrEqual(expectedExpiry - 1000);
      expect(expiresAt).toBeLessThanOrEqual(after + 60 * 60 * 1000 + 1000);
    });
  });

  describe('validateResetToken', () => {
    it('should validate a valid token', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Max',
        password_reset_token_expires: new Date(Date.now() + 3600000) // 1 hour from now
      };
      vi.mocked(db.select).mockReturnValue(createSelectMock([mockUser]) as unknown as ReturnType<typeof db.select>);

      const result = await validateResetToken({ token: 'valid-token' });

      expect(result.valid).toBe(true);
      expect(result.email).toBe('test@example.com');
      expect(result.firstName).toBe('Max');
    });

    it('should throw 404 error for invalid token', async () => {
      vi.mocked(db.select).mockReturnValue(createSelectMock([]) as unknown as ReturnType<typeof db.select>);

      await expect(validateResetToken({ token: 'invalid-token' }))
        .rejects.toMatchObject({
          status: 404,
          detail: 'Ungültiger Link. Bitte fordere einen neuen Link an.'
        });
    });

    it('should throw 410 error for expired token', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Max',
        password_reset_token_expires: new Date(Date.now() - 1000) // expired
      };
      vi.mocked(db.select).mockReturnValue(createSelectMock([mockUser]) as unknown as ReturnType<typeof db.select>);

      await expect(validateResetToken({ token: 'expired-token' }))
        .rejects.toMatchObject({
          status: 410,
          detail: 'Dieser Link ist abgelaufen. Bitte fordere einen neuen Link an.'
        });
    });

    it('should return valid for token without expiration date', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Max',
        password_reset_token_expires: null
      };
      vi.mocked(db.select).mockReturnValue(createSelectMock([mockUser]) as unknown as ReturnType<typeof db.select>);

      const result = await validateResetToken({ token: 'valid-token' });

      expect(result.valid).toBe(true);
    });
  });

  describe('resetPassword', () => {
    it('should reset password and clear token', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Max',
        expires: new Date(Date.now() + 3600000)
      };
      // Mock select to return user with valid token
      vi.mocked(db.select).mockReturnValue(createSelectMock([mockUser]) as unknown as ReturnType<typeof db.select>);
      // Mock update to return the updated user (atomic update succeeded)
      const updateMock = createUpdateMock([{ id: 1 }]);
      vi.mocked(db.update).mockReturnValue(updateMock as unknown as ReturnType<typeof db.update>);

      const result = await resetPassword({
        token: 'valid-token',
        password: 'NewPass123',
        passwordConfirm: 'NewPass123'
      });

      expect(result.success).toBe(true);
      expect(vi.mocked(db.update)).toHaveBeenCalled();
      expect(vi.mocked(hashPassword)).toHaveBeenCalledWith('NewPass123');

      // Verify token is cleared
      const setCall = updateMock.set.mock.calls[0][0];
      expect(setCall.password_reset_token).toBeNull();
      expect(setCall.password_reset_token_expires).toBeNull();
    });

    it('should throw error for invalid token during reset', async () => {
      vi.mocked(db.select).mockReturnValue(createSelectMock([]) as unknown as ReturnType<typeof db.select>);

      await expect(resetPassword({
        token: 'invalid-token',
        password: 'NewPass123',
        passwordConfirm: 'NewPass123'
      })).rejects.toMatchObject({ status: 404 });
    });

    it('should throw error for expired token during reset', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Max',
        expires: new Date(Date.now() - 1000) // expired
      };
      vi.mocked(db.select).mockReturnValue(createSelectMock([mockUser]) as unknown as ReturnType<typeof db.select>);

      await expect(resetPassword({
        token: 'expired-token',
        password: 'NewPass123',
        passwordConfirm: 'NewPass123'
      })).rejects.toMatchObject({ status: 410 });
    });

    it('should throw error if token was used between check and update (race condition)', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Max',
        expires: new Date(Date.now() + 3600000)
      };
      // Mock select to return user with valid token
      vi.mocked(db.select).mockReturnValue(createSelectMock([mockUser]) as unknown as ReturnType<typeof db.select>);
      // Mock update to return empty array (token was used by another request)
      const updateMock = createUpdateMock([]);
      vi.mocked(db.update).mockReturnValue(updateMock as unknown as ReturnType<typeof db.update>);

      await expect(resetPassword({
        token: 'valid-token',
        password: 'NewPass123',
        passwordConfirm: 'NewPass123'
      })).rejects.toMatchObject({ status: 404 });
    });
  });
});
