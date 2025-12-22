import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

// ============================================================================
// VALIDATION MIDDLEWARE (Zod Integration)
// ============================================================================
//
// ARCHITECTURE NOTE: Validates request body using Zod schemas
// - Shared schemas defined in @urc-falke/shared/schemas
// - Returns RFC 7807 Problem Details format on validation errors
// - Validation errors are in German (user-facing)
//
// SECURITY NOTE: Input validation on server-side is MANDATORY
// - Never trust client-side validation alone
// - Prevents injection attacks, malformed data
// - Same schemas used on client and server (consistency)
//
// ============================================================================

/**
 * RFC 7807 Problem Details for validation errors
 */
interface ValidationProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  errors: Array<{
    path: string[];
    message: string;
  }>;
}

/**
 * Express middleware factory for Zod schema validation
 *
 * @param schema - Zod schema to validate request body against
 * @returns Express middleware function
 *
 * @example
 * router.post('/register', validate(signupSchema), async (req, res) => {
 *   // req.body is now validated and typed
 * });
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate request body with Zod schema
      schema.parse(req.body);

      // Validation passed, continue to next middleware/handler
      next();
    } catch (error) {
      // Validation failed, return RFC 7807 Problem Details
      if (error instanceof ZodError) {
        const problemDetails: ValidationProblemDetails = {
          type: 'https://urc-falke.app/errors/validation-error',
          title: 'Validierungsfehler',
          status: 400,
          detail: 'Die eingegebenen Daten sind ungültig.',
          instance: req.originalUrl,
          errors: error.errors.map(err => ({
            path: err.path.map(String),
            message: err.message
          }))
        };

        res.status(400).json(problemDetails);
        return;
      }

      // Unexpected error (not a Zod validation error)
      res.status(500).json({
        type: 'https://urc-falke.app/errors/internal-server-error',
        title: 'Interner Serverfehler',
        status: 500,
        detail: 'Ein unerwarteter Fehler ist aufgetreten.',
        instance: req.originalUrl
      });
    }
  };
}
