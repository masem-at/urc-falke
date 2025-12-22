import { z } from 'zod';

// ============================================================================
// SIGNUP SCHEMA (Track B: New Members Registration)
// ============================================================================

export const signupSchema = z.object({
  email: z.string().email('Ungültige Email-Adresse'),
  password: z.string()
    .min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
    .regex(/[A-Z]/, 'Passwort muss mindestens einen Großbuchstaben enthalten')
    .regex(/[a-z]/, 'Passwort muss mindestens einen Kleinbuchstaben enthalten')
    .regex(/[0-9]/, 'Passwort muss mindestens eine Zahl enthalten'),
  firstName: z.string().min(2, 'Vorname muss mindestens 2 Zeichen lang sein'),
  lastName: z.string().min(2, 'Nachname muss mindestens 2 Zeichen lang sein'),
  usvNumber: z.string().optional()
});

export type SignupInput = z.infer<typeof signupSchema>;

// ============================================================================
// LOGIN SCHEMA (Both Track A and Track B)
// ============================================================================

export const loginSchema = z.object({
  email: z.string().email('Ungültige Email-Adresse'),
  password: z.string().min(1, 'Passwort ist erforderlich')
});

export type LoginInput = z.infer<typeof loginSchema>;
