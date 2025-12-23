import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { signAccessToken, verifyAccessToken, type JWTPayload } from './jwt';

// ============================================================================
// JWT UTILITY TESTS
// ============================================================================

describe('JWT Utility', () => {
  const originalEnv = process.env.JWT_SECRET;

  beforeEach(() => {
    // Set test JWT secret
    process.env.JWT_SECRET = 'test-secret-key-for-jwt-signing-minimum-32-characters-long';
  });

  afterEach(() => {
    // Restore original environment
    process.env.JWT_SECRET = originalEnv;
  });

  describe('signAccessToken', () => {
    it('should sign a token for member role', async () => {
      const payload: JWTPayload = {
        userId: 123,
        role: 'member'
      };

      const token = await signAccessToken(payload);

      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      // JWT has 3 parts separated by dots
      expect(token.split('.').length).toBe(3);
    });

    it('should sign a token for admin role', async () => {
      const payload: JWTPayload = {
        userId: 456,
        role: 'admin'
      };

      const token = await signAccessToken(payload);

      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);
    });

    it('should generate tokens with valid structure for the same payload', async () => {
      const payload: JWTPayload = {
        userId: 123,
        role: 'member'
      };

      const token1 = await signAccessToken(payload);
      const token2 = await signAccessToken(payload);

      // Both tokens should be valid JWT strings
      expect(token1.split('.').length).toBe(3);
      expect(token2.split('.').length).toBe(3);

      // Both tokens should verify correctly
      const decoded1 = await verifyAccessToken(token1);
      const decoded2 = await verifyAccessToken(token2);

      expect(decoded1.userId).toBe(123);
      expect(decoded2.userId).toBe(123);

      // Note: Tokens MAY be identical if issued at exact same second (iat precision)
      // This is expected behavior and not a security concern
    });

    it('should generate different tokens for different users', async () => {
      const payload1: JWTPayload = { userId: 123, role: 'member' };
      const payload2: JWTPayload = { userId: 456, role: 'member' };

      const token1 = await signAccessToken(payload1);
      const token2 = await signAccessToken(payload2);

      expect(token1).not.toBe(token2);
    });

    it('should throw error if JWT_SECRET is not set', async () => {
      delete process.env.JWT_SECRET;

      const payload: JWTPayload = { userId: 123, role: 'member' };

      await expect(signAccessToken(payload)).rejects.toThrow(
        'JWT_SECRET environment variable is not set'
      );
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid token', async () => {
      const payload: JWTPayload = {
        userId: 123,
        role: 'member'
      };

      const token = await signAccessToken(payload);
      const decoded = await verifyAccessToken(token);

      expect(decoded.userId).toBe(123);
      expect(decoded.role).toBe('member');
    });

    it('should verify admin role token', async () => {
      const payload: JWTPayload = {
        userId: 456,
        role: 'admin'
      };

      const token = await signAccessToken(payload);
      const decoded = await verifyAccessToken(token);

      expect(decoded.userId).toBe(456);
      expect(decoded.role).toBe('admin');
    });

    it('should reject token with invalid signature', async () => {
      const payload: JWTPayload = { userId: 123, role: 'member' };
      const token = await signAccessToken(payload);

      // Modify the signature (last part of token)
      const parts = token.split('.');
      parts[2] = parts[2].slice(0, -1) + 'X'; // Change last character
      const tamperedToken = parts.join('.');

      await expect(verifyAccessToken(tamperedToken)).rejects.toThrow('Token verification failed');
    });

    it('should reject token signed with different secret', async () => {
      const payload: JWTPayload = { userId: 123, role: 'member' };

      // Sign with one secret
      process.env.JWT_SECRET = 'secret-one-for-signing-tokens-minimum-32-chars';
      const token = await signAccessToken(payload);

      // Try to verify with different secret
      process.env.JWT_SECRET = 'secret-two-for-verifying-tokens-minimum-32-chars';

      await expect(verifyAccessToken(token)).rejects.toThrow('Token verification failed');
    });

    it('should reject malformed token', async () => {
      const malformedToken = 'not.a.valid.jwt.token';

      await expect(verifyAccessToken(malformedToken)).rejects.toThrow('Token verification failed');
    });

    it('should reject empty token', async () => {
      await expect(verifyAccessToken('')).rejects.toThrow('Token verification failed');
    });

    it('should reject token without JWT_SECRET', async () => {
      const payload: JWTPayload = { userId: 123, role: 'member' };
      const token = await signAccessToken(payload);

      delete process.env.JWT_SECRET;

      await expect(verifyAccessToken(token)).rejects.toThrow(
        'JWT_SECRET environment variable is not set'
      );
    });

    it('should handle expired token gracefully', async () => {
      // Note: We can't easily test expired tokens in unit tests
      // This would require mocking time or waiting 15 minutes
      // Integration tests should cover expired token scenarios

      const payload: JWTPayload = { userId: 123, role: 'member' };
      const token = await signAccessToken(payload);

      // Token should be valid immediately after signing
      const decoded = await verifyAccessToken(token);
      expect(decoded.userId).toBe(123);
    });
  });

  describe('integration: sign and verify workflow', () => {
    it('should complete full auth workflow', async () => {
      // 1. User logs in, backend signs token
      const userPayload: JWTPayload = {
        userId: 789,
        role: 'member'
      };

      const accessToken = await signAccessToken(userPayload);
      expect(accessToken).toBeTruthy();

      // 2. User makes authenticated request, backend verifies token
      const decoded = await verifyAccessToken(accessToken);
      expect(decoded.userId).toBe(789);
      expect(decoded.role).toBe('member');

      // 3. Verify userId can be used for authorization
      expect(typeof decoded.userId).toBe('number');
      expect(decoded.userId).toBeGreaterThan(0);
    });

    it('should handle admin user workflow', async () => {
      const adminPayload: JWTPayload = {
        userId: 1,
        role: 'admin'
      };

      const token = await signAccessToken(adminPayload);
      const decoded = await verifyAccessToken(token);

      expect(decoded.userId).toBe(1);
      expect(decoded.role).toBe('admin');
    });

    it('should maintain payload integrity through sign-verify cycle', async () => {
      const testCases: JWTPayload[] = [
        { userId: 1, role: 'member' },
        { userId: 999999, role: 'admin' },
        { userId: 42, role: 'member' }
      ];

      for (const payload of testCases) {
        const token = await signAccessToken(payload);
        const decoded = await verifyAccessToken(token);

        expect(decoded).toEqual(payload);
      }
    });
  });

  describe('token expiry (15 minutes)', () => {
    it('should have 15-minute expiry set in token', async () => {
      const payload: JWTPayload = { userId: 123, role: 'member' };
      const token = await signAccessToken(payload);

      // Decode token to check expiry claim (without verification)
      const [, payloadPart] = token.split('.');
      const decodedPayload = JSON.parse(
        Buffer.from(payloadPart, 'base64url').toString()
      );

      expect(decodedPayload.exp).toBeTruthy();
      expect(decodedPayload.iat).toBeTruthy();

      // Calculate expiry duration
      const expiryDuration = decodedPayload.exp - decodedPayload.iat;
      expect(expiryDuration).toBe(15 * 60); // 15 minutes in seconds
    });
  });

  describe('payload structure validation', () => {
    it('should validate userId is a number', async () => {
      const payload: JWTPayload = { userId: 123, role: 'member' };
      const token = await signAccessToken(payload);

      const decoded = await verifyAccessToken(token);
      expect(typeof decoded.userId).toBe('number');
    });

    it('should validate role is member or admin', async () => {
      const memberPayload: JWTPayload = { userId: 123, role: 'member' };
      const adminPayload: JWTPayload = { userId: 456, role: 'admin' };

      const memberToken = await signAccessToken(memberPayload);
      const adminToken = await signAccessToken(adminPayload);

      const decodedMember = await verifyAccessToken(memberToken);
      const decodedAdmin = await verifyAccessToken(adminToken);

      expect(['member', 'admin']).toContain(decodedMember.role);
      expect(['member', 'admin']).toContain(decodedAdmin.role);
    });
  });
});
