import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { validate } from './validate.middleware';
import { z } from 'zod';

// ============================================================================
// VALIDATION MIDDLEWARE TESTS
// ============================================================================

describe('Validation Middleware', () => {
  // Test schema
  const testSchema = z.object({
    email: z.string().email('Ungültige Email-Adresse'),
    password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen lang sein'),
    name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein')
  });

  const createMockRequest = (body: any): Partial<Request> => ({
    body,
    originalUrl: '/api/v1/test'
  });

  const createMockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };
    return res;
  };

  const createMockNext = (): NextFunction => vi.fn();

  describe('valid request body', () => {
    it('should call next() when validation passes', () => {
      const req = createMockRequest({
        email: 'test@example.com',
        password: 'SecurePass123',
        name: 'Max'
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validate(testSchema);
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledOnce();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should not modify request body when validation passes', () => {
      const requestBody = {
        email: 'test@example.com',
        password: 'SecurePass123',
        name: 'Max'
      };
      const req = createMockRequest(requestBody);
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validate(testSchema);
      middleware(req as Request, res as Response, next);

      expect(req.body).toEqual(requestBody);
    });
  });

  describe('invalid request body', () => {
    it('should return 400 with problem details when validation fails', () => {
      const req = createMockRequest({
        email: 'invalid-email',
        password: 'short',
        name: 'M'
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validate(testSchema);
      middleware(req as Request, res as Response, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'https://urc-falke.app/errors/validation-error',
          title: 'Validierungsfehler',
          status: 400,
          detail: 'Die eingegebenen Daten sind ungültig.',
          instance: '/api/v1/test',
          errors: expect.any(Array)
        })
      );
    });

    it('should return validation errors for invalid email', () => {
      const req = createMockRequest({
        email: 'invalid-email',
        password: 'SecurePass123',
        name: 'Max'
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validate(testSchema);
      middleware(req as Request, res as Response, next);

      const jsonCall = (res.json as any).mock.calls[0][0];
      expect(jsonCall.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ['email'],
            message: 'Ungültige Email-Adresse'
          })
        ])
      );
    });

    it('should return validation errors for short password', () => {
      const req = createMockRequest({
        email: 'test@example.com',
        password: 'short',
        name: 'Max'
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validate(testSchema);
      middleware(req as Request, res as Response, next);

      const jsonCall = (res.json as any).mock.calls[0][0];
      expect(jsonCall.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ['password'],
            message: 'Passwort muss mindestens 8 Zeichen lang sein'
          })
        ])
      );
    });

    it('should return multiple validation errors when multiple fields are invalid', () => {
      const req = createMockRequest({
        email: 'invalid-email',
        password: 'short',
        name: 'M'
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validate(testSchema);
      middleware(req as Request, res as Response, next);

      const jsonCall = (res.json as any).mock.calls[0][0];
      expect(jsonCall.errors.length).toBeGreaterThanOrEqual(3);

      // Check that all three fields have errors
      const errorPaths = jsonCall.errors.map((err: any) => err.path[0]);
      expect(errorPaths).toContain('email');
      expect(errorPaths).toContain('password');
      expect(errorPaths).toContain('name');
    });

    it('should return German error messages', () => {
      const req = createMockRequest({
        email: 'invalid-email',
        password: 'short',
        name: 'M'
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validate(testSchema);
      middleware(req as Request, res as Response, next);

      const jsonCall = (res.json as any).mock.calls[0][0];
      expect(jsonCall.title).toBe('Validierungsfehler');
      expect(jsonCall.detail).toBe('Die eingegebenen Daten sind ungültig.');
    });
  });

  describe('missing fields', () => {
    it('should return validation error when required field is missing', () => {
      const req = createMockRequest({
        email: 'test@example.com',
        // password is missing
        name: 'Max'
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validate(testSchema);
      middleware(req as Request, res as Response, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);

      const jsonCall = (res.json as any).mock.calls[0][0];
      const errorPaths = jsonCall.errors.map((err: any) => err.path[0]);
      expect(errorPaths).toContain('password');
    });

    it('should return validation error when all fields are missing', () => {
      const req = createMockRequest({});
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validate(testSchema);
      middleware(req as Request, res as Response, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);

      const jsonCall = (res.json as any).mock.calls[0][0];
      expect(jsonCall.errors.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('RFC 7807 compliance', () => {
    it('should return RFC 7807 compliant error response', () => {
      const req = createMockRequest({
        email: 'invalid',
        password: 'short',
        name: 'M'
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validate(testSchema);
      middleware(req as Request, res as Response, next);

      const jsonCall = (res.json as any).mock.calls[0][0];

      // RFC 7807 required fields
      expect(jsonCall).toHaveProperty('type');
      expect(jsonCall).toHaveProperty('title');
      expect(jsonCall).toHaveProperty('status');
      expect(jsonCall).toHaveProperty('detail');

      // RFC 7807 type should be URI
      expect(jsonCall.type).toMatch(/^https?:\/\//);

      // status should match HTTP status code
      expect(jsonCall.status).toBe(400);
    });

    it('should include instance field with request URL', () => {
      const req = createMockRequest({
        email: 'invalid'
      });
      req.originalUrl = '/api/v1/auth/register';
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validate(testSchema);
      middleware(req as Request, res as Response, next);

      const jsonCall = (res.json as any).mock.calls[0][0];
      expect(jsonCall.instance).toBe('/api/v1/auth/register');
    });
  });

  describe('edge cases', () => {
    it('should handle null request body', () => {
      const req = createMockRequest(null);
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validate(testSchema);
      middleware(req as Request, res as Response, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle undefined request body', () => {
      const req = createMockRequest(undefined);
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validate(testSchema);
      middleware(req as Request, res as Response, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle extra fields in request body (Zod default behavior)', () => {
      const req = createMockRequest({
        email: 'test@example.com',
        password: 'SecurePass123',
        name: 'Max',
        extraField: 'should-not-cause-error'
      });
      const res = createMockResponse();
      const next = createMockNext();

      const middleware = validate(testSchema);
      middleware(req as Request, res as Response, next);

      // Zod by default allows extra fields (passthrough)
      expect(next).toHaveBeenCalledOnce();
    });
  });
});
