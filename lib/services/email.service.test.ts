import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendEmail, sendPasswordResetEmail } from './email.service';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('EmailService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('sendEmail', () => {
    it('should send email successfully with Resend API', async () => {
      process.env.RESEND_API_KEY = 're_test_123';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'email_123' })
      });

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test content</p>'
      });

      expect(result.success).toBe(true);
      expect(result.id).toBe('email_123');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.resend.com/emails',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Authorization': 'Bearer re_test_123',
            'Content-Type': 'application/json'
          }
        })
      );
    });

    it('should return success in development mode without API key', async () => {
      process.env.RESEND_API_KEY = undefined;
      process.env.NODE_ENV = 'development';
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test content</p>'
      });

      expect(result.success).toBe(true);
      expect(mockFetch).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('EMAIL DEBUG'));

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should return failure in production mode without API key', async () => {
      process.env.RESEND_API_KEY = undefined;
      process.env.NODE_ENV = 'production';
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test content</p>'
      });

      expect(result.success).toBe(false);
      expect(mockFetch).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should handle API error response', async () => {
      process.env.RESEND_API_KEY = 're_test_123';
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid API key' })
      });

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test content</p>'
      });

      expect(result.success).toBe(false);
      expect(result.id).toBeUndefined();

      consoleErrorSpy.mockRestore();
    });

    it('should handle network errors', async () => {
      process.env.RESEND_API_KEY = 're_test_123';
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test content</p>'
      });

      expect(result.success).toBe(false);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email with correct content', async () => {
      process.env.RESEND_API_KEY = 're_test_123';
      process.env.NEXT_PUBLIC_APP_URL = 'https://urc-falke.app';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'email_123' })
      });

      const result = await sendPasswordResetEmail(
        'test@example.com',
        'reset_token_abc123',
        'Max'
      );

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.resend.com/emails',
        expect.objectContaining({
          body: expect.stringContaining('reset_token_abc123')
        })
      );

      // Verify email content in the body
      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.to).toBe('test@example.com');
      expect(callBody.subject).toBe('Passwort zurücksetzen - URC Falke');
      expect(callBody.html).toContain('Hallo Max');
      expect(callBody.html).toContain('https://urc-falke.app/reset-password/reset_token_abc123');
      expect(callBody.html).toContain('1 Stunde');
    });

    it('should use generic greeting when firstName is null', async () => {
      process.env.RESEND_API_KEY = 're_test_123';
      process.env.NEXT_PUBLIC_APP_URL = 'https://urc-falke.app';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'email_123' })
      });

      await sendPasswordResetEmail(
        'test@example.com',
        'reset_token_abc123',
        null
      );

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.html).toContain('Hallo,');
      expect(callBody.html).not.toContain('Hallo Max');
    });

    it('should use default URL when NEXT_PUBLIC_APP_URL is not set', async () => {
      process.env.RESEND_API_KEY = 're_test_123';
      process.env.NEXT_PUBLIC_APP_URL = undefined;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'email_123' })
      });

      await sendPasswordResetEmail(
        'test@example.com',
        'reset_token_abc123',
        'Max'
      );

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.html).toContain('https://urc-falke.app/reset-password/reset_token_abc123');
    });
  });
});
