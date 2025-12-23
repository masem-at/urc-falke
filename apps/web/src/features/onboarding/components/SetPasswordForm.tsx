import { useState } from 'react';
import { useSetPassword } from '../hooks';
import type { ApiError } from '../../../lib/api';

// ============================================================================
// SET PASSWORD FORM
// ============================================================================
//
// ARCHITECTURE NOTE: Password form for Track A onboarding
// - Validates password requirements (8+ chars, uppercase, lowercase, number)
// - Shows/hides password toggle
// - Displays errors in German
//
// ============================================================================

export interface SetPasswordFormProps {
  onSuccess: () => void;
}

export function SetPasswordForm({ onSuccess }: SetPasswordFormProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setPasswordMutation = useSetPassword({
    onSuccess: () => {
      onSuccess();
    },
    onError: (apiError: ApiError) => {
      setError(apiError.problem.detail);
    },
  });

  // Validate password requirements
  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];
    if (pwd.length < 8) {
      errors.push('Mindestens 8 Zeichen');
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push('Mindestens ein Großbuchstabe');
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push('Mindestens ein Kleinbuchstabe');
    }
    if (!/[0-9]/.test(pwd)) {
      errors.push('Mindestens eine Zahl');
    }
    return errors;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check password requirements
    const errors = validatePassword(password);
    if (errors.length > 0) {
      setError('Bitte erfülle alle Passwort-Anforderungen.');
      return;
    }

    // Check passwords match
    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.');
      return;
    }

    setPasswordMutation.mutate({ password });
  };

  const isValid = password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    password === confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Password requirements */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Passwort-Anforderungen:
        </p>
        <ul className="text-sm space-y-1">
          {[
            { check: password.length >= 8, text: 'Mindestens 8 Zeichen' },
            { check: /[A-Z]/.test(password), text: 'Mindestens ein Großbuchstabe' },
            { check: /[a-z]/.test(password), text: 'Mindestens ein Kleinbuchstabe' },
            { check: /[0-9]/.test(password), text: 'Mindestens eine Zahl' },
          ].map((req, i) => (
            <li key={i} className={`flex items-center ${req.check ? 'text-green-600' : 'text-gray-500'}`}>
              <span className="mr-2">{req.check ? '✓' : '○'}</span>
              {req.text}
            </li>
          ))}
        </ul>
      </div>

      {/* New Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Neues Passwort
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            value={password}
            onChange={handlePasswordChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword ? 'Verstecken' : 'Anzeigen'}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Passwort bestätigen
        </label>
        <div className="mt-1">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError(null);
            }}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
        {confirmPassword && password !== confirmPassword && (
          <p className="mt-1 text-sm text-red-600">
            Die Passwörter stimmen nicht überein.
          </p>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Submit button */}
      <div>
        <button
          type="submit"
          disabled={!isValid || setPasswordMutation.isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {setPasswordMutation.isPending ? 'Wird gespeichert...' : 'Passwort speichern'}
        </button>
      </div>
    </form>
  );
}
