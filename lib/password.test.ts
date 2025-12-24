import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from './password';

// ============================================================================
// PASSWORD HASHING UTILITY TESTS
// ============================================================================

describe('Password Hashing Utility', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'mySecurePassword123';
      const hash = await hashPassword(password);

      // Bcrypt hash should start with $2b$ (version identifier for bcrypt)
      expect(hash).toMatch(/^\$2b\$/);

      // Bcrypt hash should be approximately 60 characters
      expect(hash.length).toBeGreaterThan(50);
      expect(hash.length).toBeLessThan(70);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'mySecurePassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      // Hashes should be different due to random salt
      expect(hash1).not.toBe(hash2);
    });

    it('should hash different passwords into different hashes', async () => {
      const password1 = 'password1';
      const password2 = 'password2';

      const hash1 = await hashPassword(password1);
      const hash2 = await hashPassword(password2);

      expect(hash1).not.toBe(hash2);
    });

    it('should use 12 rounds (project standard)', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);

      // Bcrypt hash format: $2b$[rounds]$[salt+hash]
      // Extract rounds from hash (characters 4-5)
      const rounds = hash.substring(4, 6);

      expect(rounds).toBe('12');
    });

    it('should handle empty password', async () => {
      const password = '';
      const hash = await hashPassword(password);

      // Should still create a valid bcrypt hash
      expect(hash).toMatch(/^\$2b\$/);
    });

    it('should handle very long passwords', async () => {
      const password = 'a'.repeat(200);
      const hash = await hashPassword(password);

      // Should still create a valid bcrypt hash
      expect(hash).toMatch(/^\$2b\$/);
    });

    it('should handle special characters in password', async () => {
      const password = 'p@$$w0rd!#%&*()[]{}|;:,.<>?/~`';
      const hash = await hashPassword(password);

      // Should still create a valid bcrypt hash
      expect(hash).toMatch(/^\$2b\$/);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'mySecurePassword123';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'mySecurePassword123';
      const wrongPassword = 'wrongPassword';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });

    it('should reject password with slight variation', async () => {
      const password = 'mySecurePassword123';
      const slightlyWrong = 'mySecurePassword124'; // Changed last character
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(slightlyWrong, hash);
      expect(isValid).toBe(false);
    });

    it('should reject password with different case', async () => {
      const password = 'mySecurePassword123';
      const differentCase = 'MYSECUREPASSWORD123';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(differentCase, hash);
      expect(isValid).toBe(false);
    });

    it('should verify empty password if it was hashed', async () => {
      const password = '';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should handle verification with special characters', async () => {
      const password = 'p@$$w0rd!#%&*()';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should work with hash from seed-members script', async () => {
      // Test compatibility with Story 1.0 pre-seed script
      const password = 'testPassword123';
      const hash = await hashPassword(password);

      // Verify it works
      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);

      // Verify rounds match (12 rounds)
      const rounds = hash.substring(4, 6);
      expect(rounds).toBe('12');
    });
  });

  describe('integration: hash and verify workflow', () => {
    it('should complete full workflow correctly', async () => {
      // Simulate registration flow
      const userPassword = 'NewUser2025!';

      // 1. Hash password during registration
      const passwordHash = await hashPassword(userPassword);
      expect(passwordHash).toMatch(/^\$2b\$/);

      // 2. Verify password during login (correct password)
      const loginAttempt1 = await verifyPassword(userPassword, passwordHash);
      expect(loginAttempt1).toBe(true);

      // 3. Reject incorrect password during login
      const loginAttempt2 = await verifyPassword('WrongPassword!', passwordHash);
      expect(loginAttempt2).toBe(false);
    });

    it('should handle multiple users with same password', async () => {
      // Two users with same password should have different hashes
      const password = 'SamePassword123';

      const user1Hash = await hashPassword(password);
      const user2Hash = await hashPassword(password);

      // Hashes should be different (random salt)
      expect(user1Hash).not.toBe(user2Hash);

      // But both should verify correctly
      expect(await verifyPassword(password, user1Hash)).toBe(true);
      expect(await verifyPassword(password, user2Hash)).toBe(true);
    });
  });
});
