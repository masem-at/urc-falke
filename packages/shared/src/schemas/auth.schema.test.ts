import { describe, it, expect } from 'vitest';
import { signupSchema } from './auth.schema';

// ============================================================================
// SIGNUP SCHEMA VALIDATION TESTS
// ============================================================================

describe('signupSchema', () => {
  describe('email validation', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user+tag@domain.co.uk',
        'max.mustermann@urc-falke.at',
        'valid_email@test-domain.com'
      ];

      validEmails.forEach(email => {
        const result = signupSchema.safeParse({
          email,
          password: 'Valid123',
          firstName: 'Max',
          lastName: 'Mustermann'
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        'test@',
        '@example.com',
        'test @example.com',
        ''
      ];

      invalidEmails.forEach(email => {
        const result = signupSchema.safeParse({
          email,
          password: 'Valid123',
          firstName: 'Max',
          lastName: 'Mustermann'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues.some(issue => issue.path.includes('email'))).toBe(true);
        }
      });
    });

    it('should show German error message for invalid email', () => {
      const result = signupSchema.safeParse({
        email: 'invalid-email',
        password: 'Valid123',
        firstName: 'Max',
        lastName: 'Mustermann'
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const emailError = result.error.issues.find(issue => issue.path.includes('email'));
        expect(emailError?.message).toBe('Ungültige Email-Adresse');
      }
    });
  });

  describe('password validation', () => {
    it('should accept valid passwords', () => {
      const validPasswords = [
        'Valid123',
        'MyPassword1',
        'Test1234',
        'SuperSecret99'
      ];

      validPasswords.forEach(password => {
        const result = signupSchema.safeParse({
          email: 'test@example.com',
          password,
          firstName: 'Max',
          lastName: 'Mustermann'
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject passwords shorter than 8 characters', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'Short1',
        firstName: 'Max',
        lastName: 'Mustermann'
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.error.issues.find(issue => issue.path.includes('password'));
        expect(passwordError?.message).toBe('Passwort muss mindestens 8 Zeichen lang sein');
      }
    });

    it('should reject passwords without uppercase letter', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'lowercase1',
        firstName: 'Max',
        lastName: 'Mustermann'
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.error.issues.find(issue =>
          issue.path.includes('password') &&
          issue.message.includes('Großbuchstaben')
        );
        expect(passwordError?.message).toBe('Passwort muss mindestens einen Großbuchstaben enthalten');
      }
    });

    it('should reject passwords without lowercase letter', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'UPPERCASE1',
        firstName: 'Max',
        lastName: 'Mustermann'
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.error.issues.find(issue =>
          issue.path.includes('password') &&
          issue.message.includes('Kleinbuchstaben')
        );
        expect(passwordError?.message).toBe('Passwort muss mindestens einen Kleinbuchstaben enthalten');
      }
    });

    it('should reject passwords without number', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'NoNumber',
        firstName: 'Max',
        lastName: 'Mustermann'
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.error.issues.find(issue =>
          issue.path.includes('password') &&
          issue.message.includes('Zahl')
        );
        expect(passwordError?.message).toBe('Passwort muss mindestens eine Zahl enthalten');
      }
    });
  });

  describe('firstName validation', () => {
    it('should accept valid first names', () => {
      const validNames = ['Max', 'Jo', 'Maria', 'Hans-Peter'];

      validNames.forEach(firstName => {
        const result = signupSchema.safeParse({
          email: 'test@example.com',
          password: 'Valid123',
          firstName,
          lastName: 'Mustermann'
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject first names shorter than 2 characters', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'Valid123',
        firstName: 'M',
        lastName: 'Mustermann'
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find(issue => issue.path.includes('firstName'));
        expect(nameError?.message).toBe('Vorname muss mindestens 2 Zeichen lang sein');
      }
    });
  });

  describe('lastName validation', () => {
    it('should accept valid last names', () => {
      const validNames = ['Mustermann', 'Schmidt', 'Li', 'von Neumann'];

      validNames.forEach(lastName => {
        const result = signupSchema.safeParse({
          email: 'test@example.com',
          password: 'Valid123',
          firstName: 'Max',
          lastName
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject last names shorter than 2 characters', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'Valid123',
        firstName: 'Max',
        lastName: 'M'
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find(issue => issue.path.includes('lastName'));
        expect(nameError?.message).toBe('Nachname muss mindestens 2 Zeichen lang sein');
      }
    });
  });

  describe('usvNumber validation', () => {
    it('should accept valid USV numbers', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'Valid123',
        firstName: 'Max',
        lastName: 'Mustermann',
        usvNumber: 'USV123456'
      });

      expect(result.success).toBe(true);
    });

    it('should accept missing USV number (optional)', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'Valid123',
        firstName: 'Max',
        lastName: 'Mustermann'
      });

      expect(result.success).toBe(true);
    });

    it('should accept undefined USV number', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'Valid123',
        firstName: 'Max',
        lastName: 'Mustermann',
        usvNumber: undefined
      });

      expect(result.success).toBe(true);
    });
  });

  describe('complete schema validation', () => {
    it('should pass with all valid fields', () => {
      const validInput = {
        email: 'max.mustermann@urc-falke.at',
        password: 'SecurePass123',
        firstName: 'Max',
        lastName: 'Mustermann',
        usvNumber: 'USV123456'
      };

      const result = signupSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validInput);
      }
    });

    it('should fail with multiple invalid fields and return all errors', () => {
      const invalidInput = {
        email: 'invalid-email',
        password: 'short',
        firstName: 'M',
        lastName: 'M'
      };

      const result = signupSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
      if (!result.success) {
        // Should have errors for email, password (multiple), firstName, and lastName
        expect(result.error.issues.length).toBeGreaterThan(0);

        // Check that we have errors for the expected fields
        const errorPaths = result.error.issues.map(issue => issue.path[0]);
        expect(errorPaths).toContain('email');
        expect(errorPaths).toContain('password');
        expect(errorPaths).toContain('firstName');
        expect(errorPaths).toContain('lastName');
      }
    });
  });
});
