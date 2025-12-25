'use client';

import { useState } from 'react';
import Link from 'next/link';
import { forgotPasswordSchema } from '@/lib/shared';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 1. Validate email
    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message || 'Ungültige Email-Adresse');
      setIsLoading(false);
      return;
    }

    try {
      // 2. Send reset request
      const response = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || 'Ein Fehler ist aufgetreten');
        setIsLoading(false);
        return;
      }

      // 3. Show success message
      setSuccess(true);
    } catch {
      setError('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="bg-white p-8 rounded-xl shadow-sm border">
            <div className="text-green-500 text-5xl mb-4" role="img" aria-label="Erfolg">
              ✓
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Email gesendet!
            </h1>
            <p className="text-gray-600 mb-6">
              Wenn diese Email-Adresse registriert ist, erhältst du einen Link zum Zurücksetzen deines Passworts.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Prüfe auch deinen Spam-Ordner.
            </p>
            <Link
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Zurück zur Anmeldung
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
            Passwort vergessen?
          </h1>
          <p className="mt-2 text-gray-600">
            Gib deine Email-Adresse ein. Wir senden dir einen Link zum Zurücksetzen deines Passworts.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email-Adresse
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? 'email-error' : undefined}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                placeholder="deine@email.at"
              />
              {error && (
                <p
                  id="email-error"
                  role="alert"
                  className="mt-2 text-sm text-red-600"
                >
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[44px] px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Wird gesendet...' : 'Link senden'}
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
