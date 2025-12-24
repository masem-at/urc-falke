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
  firstName: z.string().min(2, 'Vorname muss mindestens 2 Zeichen lang sein').optional(),
  lastName: z.string().min(2, 'Nachname muss mindestens 2 Zeichen lang sein').optional(),
  nickname: z.string().max(50, 'Spitzname zu lang (max. 50 Zeichen)').optional(),
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

// ============================================================================
// ONBOARD EXISTING SCHEMA (Track A: Token-Based Auto-Login)
// ============================================================================

export const onboardExistingSchema = z.object({
  token: z.string().min(1, 'Token wird benötigt')
});

export type OnboardExistingInput = z.infer<typeof onboardExistingSchema>;

// ============================================================================
// SET PASSWORD SCHEMA (Track A: Change initial password)
// ============================================================================

export const setPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
    .regex(/[A-Z]/, 'Passwort muss mindestens einen Großbuchstaben enthalten')
    .regex(/[a-z]/, 'Passwort muss mindestens einen Kleinbuchstaben enthalten')
    .regex(/[0-9]/, 'Passwort muss mindestens eine Zahl enthalten')
});

export type SetPasswordInput = z.infer<typeof setPasswordSchema>;

// ============================================================================
// COMPLETE PROFILE SCHEMA (Track A: Finalize onboarding)
// ============================================================================

export const completeProfileSchema = z.object({
  firstName: z.string().min(2, 'Vorname muss mindestens 2 Zeichen lang sein').optional(),
  lastName: z.string().min(2, 'Nachname muss mindestens 2 Zeichen lang sein').optional(),
  profileImageUrl: z.string().url('Ungültige URL für Profilbild').optional()
});

export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;

// ============================================================================
// USV VERIFICATION SCHEMA
// ============================================================================

export const usvVerifySchema = z.object({
  usvNumber: z.string()
    .regex(/^USV[0-9]{6}$/, 'USV-Nummer muss im Format USV123456 sein')
});

export type USVVerifyInput = z.infer<typeof usvVerifySchema>;
