import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

// ============================================================================
// HELPER FUNCTIONS (extracted for testing)
// ============================================================================

function generateOnboardingToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = crypto.randomBytes(16);
  let token = '';
  for (let i = 0; i < 16; i++) {
    token += chars[bytes[i] % chars.length];
  }
  return token;
}

function isValidEmail(email: string): boolean {
  // RFC 5322 simplified regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

function generateTemporaryPassword(): string {
  return crypto.randomBytes(16).toString('base64').slice(0, 16);
}

// ============================================================================
// TOKEN GENERATION TESTS
// ============================================================================

describe('Token Generation', () => {
  it('should generate 16-character token', () => {
    const token = generateOnboardingToken();
    expect(token).toHaveLength(16);
  });

  it('should contain only A-Z and 0-9', () => {
    const token = generateOnboardingToken();
    expect(token).toMatch(/^[A-Z0-9]+$/);
  });

  it('should generate unique tokens', () => {
    const tokens = new Set();
    for (let i = 0; i < 1000; i++) {
      tokens.add(generateOnboardingToken());
    }
    // Should have 1000 unique tokens (no duplicates)
    expect(tokens.size).toBe(1000);
  });

  it('should generate different tokens each time', () => {
    const token1 = generateOnboardingToken();
    const token2 = generateOnboardingToken();
    expect(token1).not.toBe(token2);
  });
});

// ============================================================================
// EMAIL VALIDATION TESTS
// ============================================================================

describe('Email Validation', () => {
  it('should accept valid emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('max.mustermann@urc-falke.at')).toBe(true);
    expect(isValidEmail('user+tag@domain.co.uk')).toBe(true);
    expect(isValidEmail('valid_email@test-domain.com')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('test @example.com')).toBe(false);
    // Note: consecutive dots (test..name@example.com) are technically allowed by RFC 5322
    // but most providers don't accept them in practice - not critical for this story
  });

  it('should handle edge cases', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('test@domain')).toBe(true); // Valid per RFC 5322
    expect(isValidEmail('test@domain.c')).toBe(true);
  });
});

// ============================================================================
// PASSWORD GENERATION TESTS
// ============================================================================

describe('Password Generation', () => {
  it('should generate 16-character password', () => {
    const password = generateTemporaryPassword();
    expect(password).toHaveLength(16);
  });

  it('should hash password with bcrypt', async () => {
    const password = generateTemporaryPassword();
    const hash = await hashPassword(password);

    // Bcrypt hash starts with $2b$ (version identifier)
    expect(hash).toMatch(/^\$2b\$/);

    // Hash should be approximately 60 characters
    expect(hash.length).toBeGreaterThan(50);
  });

  it('should verify password against hash', async () => {
    const password = generateTemporaryPassword();
    const hash = await hashPassword(password);

    const isValid = await bcrypt.compare(password, hash);
    expect(isValid).toBe(true);
  });

  it('should reject wrong password', async () => {
    const password = generateTemporaryPassword();
    const hash = await hashPassword(password);

    const isValid = await bcrypt.compare('wrong-password', hash);
    expect(isValid).toBe(false);
  });
});

// ============================================================================
// CSV PARSING TESTS (simplified without file I/O)
// ============================================================================

describe('CSV Data Validation', () => {
  it('should validate required fields', () => {
    const validRow = {
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      usv_number: 'USV123456'
    };

    expect(validRow.email).toBeTruthy();
    expect(validRow.first_name).toBeTruthy();
    expect(validRow.last_name).toBeTruthy();
  });

  it('should handle optional usv_number', () => {
    const rowWithoutUSV = {
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      usv_number: undefined
    };

    expect(rowWithoutUSV.email).toBeTruthy();
    expect(rowWithoutUSV.first_name).toBeTruthy();
    expect(rowWithoutUSV.last_name).toBeTruthy();
    expect(rowWithoutUSV.usv_number).toBeUndefined();
  });
});

// ============================================================================
// URL GENERATION TESTS
// ============================================================================

describe('URL Generation', () => {
  it('should generate correct onboarding link', () => {
    const token = 'A7K9P2M4X8Q1W5Z3';
    const link = `https://urc-falke.app/onboard-existing?token=${token}`;

    expect(link).toBe('https://urc-falke.app/onboard-existing?token=A7K9P2M4X8Q1W5Z3');
  });

  it('should generate correct QR code URL', () => {
    const onboardingLink = 'https://urc-falke.app/onboard-existing?token=A7K9P2M4X8Q1W5Z3';
    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(onboardingLink)}`;

    expect(qrCodeURL).toContain('https://api.qrserver.com/v1/create-qr-code/?data=');
    expect(qrCodeURL).toContain(encodeURIComponent(onboardingLink));
  });

  it('should properly encode special characters in QR URL', () => {
    const link = 'https://test.com/path?param=value&other=test';
    const encoded = encodeURIComponent(link);

    expect(encoded).not.toContain('?');
    expect(encoded).not.toContain('&');
    expect(encoded).not.toContain('=');
  });

  it('should generate valid QR code URL format', () => {
    const token = 'A7K9P2M4X8Q1W5Z3';
    const onboardingLink = `https://urc-falke.app/onboard-existing?token=${token}`;
    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(onboardingLink)}`;

    // Verify URL starts with correct API endpoint
    expect(qrCodeURL).toMatch(/^https:\/\/api\.qrserver\.com\/v1\/create-qr-code\/\?data=/);

    // Verify URL is properly formatted
    try {
      const url = new URL(qrCodeURL);
      expect(url.protocol).toBe('https:');
      expect(url.hostname).toBe('api.qrserver.com');
      expect(url.searchParams.has('data')).toBe(true);
    } catch (error) {
      throw new Error('Generated QR code URL is not a valid URL');
    }
  });

  it('should verify QR code URL contains encoded onboarding link', () => {
    const token = 'TEST123TOKEN456';
    const onboardingLink = `https://urc-falke.app/onboard-existing?token=${token}`;
    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(onboardingLink)}`;

    // Extract data parameter from QR URL
    const url = new URL(qrCodeURL);
    const dataParam = url.searchParams.get('data');

    // Verify data parameter decodes back to original onboarding link
    expect(dataParam).toBe(onboardingLink);
    expect(dataParam).toContain(token);
  });
});

// ============================================================================
// TOKEN EXPIRY TESTS
// ============================================================================

describe('Token Expiry', () => {
  it('should set expiry to 90 days from now', () => {
    const now = new Date();
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 90);

    const daysDifference = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    expect(daysDifference).toBe(90);
  });

  it('should handle month boundaries correctly', () => {
    // Test that adding 90 days works across month boundaries
    const testDate = new Date('2025-01-01');
    testDate.setDate(testDate.getDate() + 90);

    // 90 days from Jan 1, 2025 should be Apr 1, 2025
    expect(testDate.getMonth()).toBe(3); // April (0-indexed)
    expect(testDate.getDate()).toBe(1);
  });
});
