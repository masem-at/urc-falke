import { describe, it, expect, beforeEach, vi } from 'vitest';
import { registerUser, loginUser, onboardExistingUser } from './auth.service';
import type { SignupInput, LoginInput, OnboardExistingInput } from '@/lib/shared';
import * as passwordModule from '../password';
import * as jwtModule from '../jwt';
import * as dbModule from '../db/connection';
import { users as _users } from '@/lib/shared/db';

// ============================================================================
// REGISTRATION SERVICE TESTS
// ============================================================================
//
// NOTE: These are unit tests with mocked database operations
// Integration tests with real database are in auth.routes.test.ts
//
// ============================================================================

describe('Registration Service', () => {
  describe('registerUser', () => {
    beforeEach(() => {
      // Clear all mocks before each test
      vi.clearAllMocks();
    });

    it('should successfully register a new user', async () => {
      const input: SignupInput = {
        email: 'test@example.com',
        password: 'SecurePass123',
        firstName: 'Max',
        lastName: 'Mustermann',
        usvNumber: 'USV123456'
      };

      // Mock database: no existing user
      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([]) // No existing user
      };

      // Mock database: insert returns new user
      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{
          id: 1,
          email: 'test@example.com',
          password_hash: '$2b$12$hashedPassword',
          first_name: 'Max',
          last_name: 'Mustermann',
          usv_number: 'USV123456',
          role: 'member',
          onboarding_status: 'completed',
          is_founding_member: false,
          is_usv_verified: false,
          profile_image_url: null,
          onboarding_token: null,
          onboarding_token_expires: null,
          must_change_password: false,
          lottery_registered: false,
          created_at: new Date(),
          updated_at: new Date()
        }])
      };

      // Mock db operations
      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);
      vi.spyOn(dbModule.db, 'insert').mockReturnValue(mockInsert as any);

      // Mock password hashing
      vi.spyOn(passwordModule, 'hashPassword').mockResolvedValue('$2b$12$hashedPassword');

      // Mock JWT signing
      vi.spyOn(jwtModule, 'signAccessToken').mockResolvedValue('mock.jwt.token');

      const result = await registerUser(input);

      // Verify result
      expect(result.user.id).toBe(1);
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.first_name).toBe('Max');
      expect(result.user.last_name).toBe('Mustermann');
      expect(result.user.usv_number).toBe('USV123456');
      expect(result.user.role).toBe('member');
      expect(result.user.onboarding_status).toBe('completed');
      expect(result.accessToken).toBe('mock.jwt.token');

      // CRITICAL: password_hash should NOT be in response
      expect((result.user as any).password_hash).toBeUndefined();

      // Verify password was hashed
      expect(passwordModule.hashPassword).toHaveBeenCalledWith('SecurePass123');

      // Verify JWT was generated
      expect(jwtModule.signAccessToken).toHaveBeenCalledWith({
        userId: 1,
        role: 'member'
      });
    });

    it('should throw 409 error when email already exists', async () => {
      const input: SignupInput = {
        email: 'existing@example.com',
        password: 'SecurePass123',
        firstName: 'Max',
        lastName: 'Mustermann'
      };

      // Mock database: existing user found
      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([
          { id: 1, email: 'existing@example.com' }
        ])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);

      await expect(registerUser(input)).rejects.toMatchObject({
        status: 409,
        title: 'Email bereits registriert',
        detail: 'Ein Benutzer mit dieser Email existiert bereits.',
        type: 'https://urc-falke.app/errors/email-already-exists'
      });
    });

    it('should handle optional usvNumber field', async () => {
      const input: SignupInput = {
        email: 'test@example.com',
        password: 'SecurePass123',
        firstName: 'Max',
        lastName: 'Mustermann'
        // usvNumber is optional
      };

      // Mock database: no existing user
      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([])
      };

      // Mock database: insert returns new user without USV number
      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{
          id: 2,
          email: 'test@example.com',
          password_hash: '$2b$12$hashedPassword',
          first_name: 'Max',
          last_name: 'Mustermann',
          usv_number: null, // No USV number
          role: 'member',
          onboarding_status: 'completed',
          is_founding_member: false,
          is_usv_verified: false,
          profile_image_url: null,
          onboarding_token: null,
          onboarding_token_expires: null,
          must_change_password: false,
          lottery_registered: false,
          created_at: new Date(),
          updated_at: new Date()
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);
      vi.spyOn(dbModule.db, 'insert').mockReturnValue(mockInsert as any);
      vi.spyOn(passwordModule, 'hashPassword').mockResolvedValue('$2b$12$hashedPassword');
      vi.spyOn(jwtModule, 'signAccessToken').mockResolvedValue('mock.jwt.token');

      const result = await registerUser(input);

      expect(result.user.usv_number).toBeNull();
    });

    it('should set onboarding_status to completed for Track B users', async () => {
      const input: SignupInput = {
        email: 'test@example.com',
        password: 'SecurePass123',
        firstName: 'Max',
        lastName: 'Mustermann'
      };

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([])
      };

      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{
          id: 3,
          email: 'test@example.com',
          password_hash: '$2b$12$hashedPassword',
          first_name: 'Max',
          last_name: 'Mustermann',
          usv_number: null,
          role: 'member',
          onboarding_status: 'completed', // Track B: directly completed
          is_founding_member: false,
          is_usv_verified: false,
          profile_image_url: null,
          onboarding_token: null,
          onboarding_token_expires: null,
          must_change_password: false,
          lottery_registered: false,
          created_at: new Date(),
          updated_at: new Date()
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);
      vi.spyOn(dbModule.db, 'insert').mockReturnValue(mockInsert as any);
      vi.spyOn(passwordModule, 'hashPassword').mockResolvedValue('$2b$12$hashedPassword');
      vi.spyOn(jwtModule, 'signAccessToken').mockResolvedValue('mock.jwt.token');

      const result = await registerUser(input);

      expect(result.user.onboarding_status).toBe('completed');
    });

    it('should map camelCase input to snake_case database fields', async () => {
      const input: SignupInput = {
        email: 'test@example.com',
        password: 'SecurePass123',
        firstName: 'Max', // camelCase
        lastName: 'Mustermann' // camelCase
      };

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([])
      };

      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{
          id: 4,
          email: 'test@example.com',
          password_hash: '$2b$12$hashedPassword',
          first_name: 'Max', // snake_case in DB
          last_name: 'Mustermann', // snake_case in DB
          usv_number: null,
          role: 'member',
          onboarding_status: 'completed',
          is_founding_member: false,
          is_usv_verified: false,
          profile_image_url: null,
          onboarding_token: null,
          onboarding_token_expires: null,
          must_change_password: false,
          lottery_registered: false,
          created_at: new Date(),
          updated_at: new Date()
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);
      vi.spyOn(dbModule.db, 'insert').mockReturnValue(mockInsert as any);
      vi.spyOn(passwordModule, 'hashPassword').mockResolvedValue('$2b$12$hashedPassword');
      vi.spyOn(jwtModule, 'signAccessToken').mockResolvedValue('mock.jwt.token');

      const result = await registerUser(input);

      // DB should have snake_case fields
      expect(result.user.first_name).toBe('Max');
      expect(result.user.last_name).toBe('Mustermann');
    });

    it('should never return password_hash in response', async () => {
      const input: SignupInput = {
        email: 'test@example.com',
        password: 'SecurePass123',
        firstName: 'Max',
        lastName: 'Mustermann'
      };

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([])
      };

      const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{
          id: 5,
          email: 'test@example.com',
          password_hash: '$2b$12$hashedPassword', // This should be removed
          first_name: 'Max',
          last_name: 'Mustermann',
          usv_number: null,
          role: 'member',
          onboarding_status: 'completed',
          is_founding_member: false,
          is_usv_verified: false,
          profile_image_url: null,
          onboarding_token: null,
          onboarding_token_expires: null,
          must_change_password: false,
          lottery_registered: false,
          created_at: new Date(),
          updated_at: new Date()
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);
      vi.spyOn(dbModule.db, 'insert').mockReturnValue(mockInsert as any);
      vi.spyOn(passwordModule, 'hashPassword').mockResolvedValue('$2b$12$hashedPassword');
      vi.spyOn(jwtModule, 'signAccessToken').mockResolvedValue('mock.jwt.token');

      const result = await registerUser(input);

      // SECURITY CHECK: password_hash should NOT be in response
      expect((result.user as any).password_hash).toBeUndefined();
      expect(Object.keys(result.user)).not.toContain('password_hash');
    });
  });
});

// ============================================================================
// LOGIN SERVICE TESTS
// ============================================================================
//
// NOTE: These are unit tests with mocked database operations
// Tests cover: successful login, invalid email, invalid password,
// JWT generation, password_hash exclusion, must_change_password flag
//
// ============================================================================

describe('Login Service', () => {
  describe('loginUser', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should successfully login with valid credentials', async () => {
      const input: LoginInput = {
        email: 'test@example.com',
        password: 'SecurePass123'
      };

      // Mock database: user found
      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 1,
          email: 'test@example.com',
          password_hash: '$2b$12$hashedPassword',
          first_name: 'Max',
          last_name: 'Mustermann',
          usv_number: 'USV123456',
          role: 'member',
          onboarding_status: 'completed',
          is_founding_member: false,
          is_usv_verified: false,
          profile_image_url: null,
          onboarding_token: null,
          onboarding_token_expires: null,
          must_change_password: false,
          lottery_registered: false,
          created_at: new Date(),
          updated_at: new Date()
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);
      vi.spyOn(passwordModule, 'verifyPassword').mockResolvedValue(true);
      vi.spyOn(jwtModule, 'signAccessToken').mockResolvedValue('mock.jwt.token');

      const result = await loginUser(input);

      expect(result.user.id).toBe(1);
      expect(result.user.email).toBe('test@example.com');
      expect(result.accessToken).toBe('mock.jwt.token');
      expect(result.mustChangePassword).toBe(false);
      expect((result.user as any).password_hash).toBeUndefined();
    });

    it('should throw 401 for non-existent email', async () => {
      const input: LoginInput = {
        email: 'nonexistent@example.com',
        password: 'SecurePass123'
      };

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([]) // No user found
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);

      await expect(loginUser(input)).rejects.toMatchObject({
        status: 401,
        title: 'Ungültige Anmeldedaten',
        detail: 'Email oder Passwort ist falsch.'
      });
    });

    it('should throw 401 for incorrect password', async () => {
      const input: LoginInput = {
        email: 'test@example.com',
        password: 'WrongPassword'
      };

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 1,
          email: 'test@example.com',
          password_hash: '$2b$12$hashedPassword',
          first_name: 'Max',
          last_name: 'Mustermann',
          role: 'member',
          must_change_password: false
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);
      vi.spyOn(passwordModule, 'verifyPassword').mockResolvedValue(false);

      await expect(loginUser(input)).rejects.toMatchObject({
        status: 401,
        title: 'Ungültige Anmeldedaten',
        detail: 'Email oder Passwort ist falsch.'
      });
    });

    it('should return same error for invalid email and password (security)', async () => {
      // Test that error messages are identical to prevent email enumeration

      // Test 1: Non-existent email
      const mockSelectNoUser = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([])
      };
      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelectNoUser as any);

      let error1: any;
      try {
        await loginUser({ email: 'nonexistent@example.com', password: 'any' });
      } catch (e) {
        error1 = e;
      }

      // Test 2: Wrong password
      vi.clearAllMocks();
      const mockSelectWithUser = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 1,
          email: 'test@example.com',
          password_hash: '$2b$12$hashedPassword',
          must_change_password: false
        }])
      };
      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelectWithUser as any);
      vi.spyOn(passwordModule, 'verifyPassword').mockResolvedValue(false);

      let error2: any;
      try {
        await loginUser({ email: 'test@example.com', password: 'wrong' });
      } catch (e) {
        error2 = e;
      }

      // SECURITY: Both errors should be identical
      expect(error1.detail).toBe(error2.detail);
      expect(error1.title).toBe(error2.title);
      expect(error1.status).toBe(error2.status);
    });

    it('should generate JWT token on successful login', async () => {
      const input: LoginInput = {
        email: 'test@example.com',
        password: 'SecurePass123'
      };

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 42,
          email: 'test@example.com',
          password_hash: '$2b$12$hashedPassword',
          role: 'admin',
          must_change_password: false
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);
      vi.spyOn(passwordModule, 'verifyPassword').mockResolvedValue(true);
      vi.spyOn(jwtModule, 'signAccessToken').mockResolvedValue('mock.jwt.token');

      await loginUser(input);

      expect(jwtModule.signAccessToken).toHaveBeenCalledWith({
        userId: 42,
        role: 'admin'
      });
    });

    it('should never return password_hash in response', async () => {
      const input: LoginInput = {
        email: 'test@example.com',
        password: 'SecurePass123'
      };

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 1,
          email: 'test@example.com',
          password_hash: '$2b$12$verySecretHash', // Should be removed
          first_name: 'Max',
          role: 'member',
          must_change_password: false
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);
      vi.spyOn(passwordModule, 'verifyPassword').mockResolvedValue(true);
      vi.spyOn(jwtModule, 'signAccessToken').mockResolvedValue('mock.jwt.token');

      const result = await loginUser(input);

      expect((result.user as any).password_hash).toBeUndefined();
      expect(Object.keys(result.user)).not.toContain('password_hash');
    });

    it('should return must_change_password flag', async () => {
      const input: LoginInput = {
        email: 'test@example.com',
        password: 'SecurePass123'
      };

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 1,
          email: 'test@example.com',
          password_hash: '$2b$12$hashedPassword',
          role: 'member',
          must_change_password: false
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);
      vi.spyOn(passwordModule, 'verifyPassword').mockResolvedValue(true);
      vi.spyOn(jwtModule, 'signAccessToken').mockResolvedValue('mock.jwt.token');

      const result = await loginUser(input);

      expect(result).toHaveProperty('mustChangePassword');
      expect(result.mustChangePassword).toBe(false);
    });

    it('should return mustChangePassword: true for pre-seeded users (Track A)', async () => {
      const input: LoginInput = {
        email: 'preseeded@example.com',
        password: 'TempPassword123'
      };

      // Pre-seeded user has must_change_password: true
      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 99,
          email: 'preseeded@example.com',
          password_hash: '$2b$12$hashedPassword',
          role: 'member',
          onboarding_status: 'pending_password',
          must_change_password: true // Track A user
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);
      vi.spyOn(passwordModule, 'verifyPassword').mockResolvedValue(true);
      vi.spyOn(jwtModule, 'signAccessToken').mockResolvedValue('mock.jwt.token');

      const result = await loginUser(input);

      expect(result.mustChangePassword).toBe(true);
    });

    it('should handle null must_change_password as false', async () => {
      const input: LoginInput = {
        email: 'test@example.com',
        password: 'SecurePass123'
      };

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 1,
          email: 'test@example.com',
          password_hash: '$2b$12$hashedPassword',
          role: 'member',
          must_change_password: null // Legacy user or undefined
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);
      vi.spyOn(passwordModule, 'verifyPassword').mockResolvedValue(true);
      vi.spyOn(jwtModule, 'signAccessToken').mockResolvedValue('mock.jwt.token');

      const result = await loginUser(input);

      expect(result.mustChangePassword).toBe(false);
    });
  });
});

// ============================================================================
// ONBOARD EXISTING USER SERVICE TESTS (Track A: Token-Based Auto-Login)
// ============================================================================
//
// NOTE: These are unit tests with mocked database operations
// Tests cover: valid token login, token not found, token expired,
// token already used (status !== 'pre_seeded')
//
// ============================================================================

describe('Onboard Existing User Service', () => {
  describe('onboardExistingUser', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should successfully auto-login with valid onboarding token', async () => {
      const input: OnboardExistingInput = {
        token: 'valid-onboarding-token-123'
      };

      // Mock: Valid pre-seeded user found with unexpired token
      const futureDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days from now
      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 42,
          email: 'preseeded@example.com',
          password_hash: '$2b$12$hashedPassword',
          first_name: 'Max',
          last_name: 'Mustermann',
          usv_number: 'USV123456',
          role: 'member',
          onboarding_status: 'pre_seeded',
          onboarding_token: 'valid-onboarding-token-123',
          onboarding_token_expires: futureDate,
          must_change_password: true,
          is_founding_member: true,
          is_usv_verified: false,
          profile_image_url: null,
          lottery_registered: false,
          created_at: new Date(),
          updated_at: new Date()
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);
      vi.spyOn(jwtModule, 'signAccessToken').mockResolvedValue('mock.jwt.token');

      const result = await onboardExistingUser(input);

      // Verify JWT was generated
      expect(jwtModule.signAccessToken).toHaveBeenCalledWith({
        userId: 42,
        role: 'member'
      });

      // Verify result
      expect(result.user.id).toBe(42);
      expect(result.user.email).toBe('preseeded@example.com');
      expect(result.user.first_name).toBe('Max');
      expect(result.accessToken).toBe('mock.jwt.token');
      expect(result.redirectTo).toBe('/onboard-existing/set-password');

      // SECURITY: password_hash should NOT be in response
      expect((result.user as any).password_hash).toBeUndefined();
    });

    it('should throw 404 when token does not exist', async () => {
      const input: OnboardExistingInput = {
        token: 'nonexistent-token'
      };

      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([]) // No user found
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);

      await expect(onboardExistingUser(input)).rejects.toMatchObject({
        status: 404,
        title: 'Token nicht gefunden',
        type: 'https://urc-falke.app/errors/token-not-found'
      });
    });

    it('should throw 410 when token is expired', async () => {
      const input: OnboardExistingInput = {
        token: 'expired-token'
      };

      // Mock: User found but token is expired
      const pastDate = new Date(Date.now() - 1000); // 1 second ago
      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 1,
          email: 'expired@example.com',
          password_hash: '$2b$12$hashedPassword',
          onboarding_status: 'pre_seeded',
          onboarding_token: 'expired-token',
          onboarding_token_expires: pastDate, // EXPIRED
          must_change_password: true
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);

      await expect(onboardExistingUser(input)).rejects.toMatchObject({
        status: 410,
        title: 'Token abgelaufen',
        type: 'https://urc-falke.app/errors/token-expired'
      });
    });

    it('should throw 409 when token is already used (onboarding_status !== pre_seeded)', async () => {
      const input: OnboardExistingInput = {
        token: 'used-token'
      };

      // Mock: User found but status is not 'pre_seeded' (already activated)
      const futureDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 1,
          email: 'activated@example.com',
          password_hash: '$2b$12$hashedPassword',
          onboarding_status: 'password_changed', // NOT 'pre_seeded'
          onboarding_token: 'used-token',
          onboarding_token_expires: futureDate,
          must_change_password: false
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);

      await expect(onboardExistingUser(input)).rejects.toMatchObject({
        status: 409,
        title: 'Account bereits aktiviert',
        type: 'https://urc-falke.app/errors/token-already-used'
      });
    });

    it('should throw 409 when onboarding_status is completed', async () => {
      const input: OnboardExistingInput = {
        token: 'completed-user-token'
      };

      const futureDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 1,
          email: 'completed@example.com',
          password_hash: '$2b$12$hashedPassword',
          onboarding_status: 'completed', // Fully completed
          onboarding_token: 'completed-user-token',
          onboarding_token_expires: futureDate,
          must_change_password: false
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);

      await expect(onboardExistingUser(input)).rejects.toMatchObject({
        status: 409,
        title: 'Account bereits aktiviert'
      });
    });

    it('should never return password_hash in response', async () => {
      const input: OnboardExistingInput = {
        token: 'valid-token'
      };

      const futureDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 1,
          email: 'test@example.com',
          password_hash: '$2b$12$verySecretHash', // Should be removed
          first_name: 'Max',
          last_name: 'Mustermann',
          role: 'member',
          onboarding_status: 'pre_seeded',
          onboarding_token: 'valid-token',
          onboarding_token_expires: futureDate,
          must_change_password: true
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);
      vi.spyOn(jwtModule, 'signAccessToken').mockResolvedValue('mock.jwt.token');

      const result = await onboardExistingUser(input);

      // SECURITY CHECK: password_hash should NOT be in response
      expect((result.user as any).password_hash).toBeUndefined();
      expect(Object.keys(result.user)).not.toContain('password_hash');
    });

    it('should generate JWT token with correct payload', async () => {
      const input: OnboardExistingInput = {
        token: 'valid-token'
      };

      const futureDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      const mockSelect = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 99,
          email: 'admin@example.com',
          password_hash: '$2b$12$hashedPassword',
          role: 'admin',
          onboarding_status: 'pre_seeded',
          onboarding_token: 'valid-token',
          onboarding_token_expires: futureDate,
          must_change_password: true
        }])
      };

      vi.spyOn(dbModule.db, 'select').mockReturnValue(mockSelect as any);
      vi.spyOn(jwtModule, 'signAccessToken').mockResolvedValue('mock.jwt.token');

      await onboardExistingUser(input);

      expect(jwtModule.signAccessToken).toHaveBeenCalledWith({
        userId: 99,
        role: 'admin'
      });
    });
  });
});
