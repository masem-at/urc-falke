'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { resetPasswordSchema } from '@/lib/shared';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [tokenError, setTokenError] = useState('');

  // Validate token on mount
  useEffect(() => {
    async function validateToken() {
      try {
        const response = await fetch(`/api/v1/auth/reset-password/${token}`);
        const data = await response.json();

        if (!response.ok) {
          setTokenError(data.detail || 'Ungültiger Link');
        }
      } catch {
        setTokenError('Ein Fehler ist aufgetreten');
      } finally {
        setIsValidating(false);
      }
    }

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setIsLoading(true);

    // 1. Validate input
    const parsed = resetPasswordSchema.safeParse({ token, password, passwordConfirm });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        errors[field] = err.message;
      });
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      // 2. Reset password
      const response = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, passwordConfirm })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 410) {
          // Token expired
          setTokenError(data.detail);
        } else if (response.status === 404) {
          // Token invalid
          setTokenError(data.detail);
        } else {
          setError(data.detail || 'Ein Fehler ist aufgetreten');
        }
        setIsLoading(false);
        return;
      }

      // 3. Redirect to login with success message
      router.push('/login?reset=success');
    } catch {
      setError('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Lädt...</p>
        </div>
      </div>
    );
  }

  // Token error state
  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="bg-white p-8 rounded-xl shadow-sm border">
            <div className="text-red-500 text-5xl mb-4" role="img" aria-label="Fehler">
              ✕
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Link ungültig
            </h1>
            <p className="text-gray-600 mb-6" role="alert">
              {tokenError}
            </p>
            <Link
              href="/forgot-password"
              className="inline-block min-h-[44px] px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Neuen Link anfordern
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Neues Passwort festlegen
          </h1>
          <p className="mt-2 text-gray-600">
            Wähle ein sicheres Passwort für deinen Account.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Neues Passwort
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? 'password-error' : 'password-hint'}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded"
                  aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {fieldErrors.password ? (
                <p id="password-error" role="alert" className="mt-2 text-sm text-red-600">
                  {fieldErrors.password}
                </p>
              ) : (
                <p id="password-hint" className="mt-2 text-sm text-gray-500">
                  Min. 8 Zeichen, ein Großbuchstabe, ein Kleinbuchstabe, eine Zahl
                </p>
              )}
            </div>

            {/* Password Confirmation Field */}
            <div>
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Passwort bestätigen
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="passwordConfirm"
                  name="passwordConfirm"
                  autoComplete="new-password"
                  required
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  aria-invalid={!!fieldErrors.passwordConfirm}
                  aria-describedby={fieldErrors.passwordConfirm ? 'confirm-error' : undefined}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded"
                  aria-label={showConfirmPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {fieldErrors.passwordConfirm && (
                <p id="confirm-error" role="alert" className="mt-2 text-sm text-red-600">
                  {fieldErrors.passwordConfirm}
                </p>
              )}
            </div>

            {/* General Error */}
            {error && (
              <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[44px] px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Wird gespeichert...' : 'Passwort ändern'}
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Zurück zur Anmeldung
          </Link>
        </div>
      </div>
    </div>
  );
}
