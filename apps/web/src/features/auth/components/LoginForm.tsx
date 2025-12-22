import { useState, type FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useLogin } from '../hooks';

// ============================================================================
// LOGIN FORM COMPONENT
// ============================================================================
//
// ARCHITECTURE NOTE: Accessible form with German error messages
// - Password show/hide toggle for accessibility (AC6)
// - "Passwort vergessen?" link for password recovery
// - 44x44px minimum touch target for accessibility (WCAG 2.1 AA)
// - German error messages from API
//
// TWO-TRACK ONBOARDING:
// - On successful login, checks mustChangePassword
// - If true, triggers onMustChangePassword callback
// - Parent component handles redirect to password change page
//
// ============================================================================

export interface LoginFormProps {
  onSuccess?: () => void;
  onMustChangePassword?: () => void;
}

export function LoginForm({ onSuccess, onMustChangePassword }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loginMutation = useLogin({
    onSuccess: (data) => {
      if (data.mustChangePassword) {
        // Track A user: must change password
        onMustChangePassword?.();
      } else {
        // Track B user or Track A with password already changed
        setSuccessMessage('Willkommen zurück!');
        onSuccess?.();
      }
    },
    onError: (apiError) => {
      setError(apiError.problem.detail);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Basic client-side validation
    if (!email) {
      setError('Bitte gib deine Email-Adresse ein.');
      return;
    }
    if (!password) {
      setError('Bitte gib dein Passwort ein.');
      return;
    }

    loginMutation.mutate({ email, password });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
          placeholder="max@example.com"
          aria-describedby={error ? 'login-error' : undefined}
        />
      </div>

      {/* Password Field with Show/Hide Toggle */}
      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Passwort
          </label>
          <a
            href="/forgot-password"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Passwort vergessen?
          </a>
        </div>
        <div className="relative mt-1">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 pr-10 border"
            aria-describedby={error ? 'login-error' : undefined}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 min-h-[44px] min-w-[44px] justify-center"
            aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div
          role="status"
          className="rounded-md bg-green-50 p-4"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          id="login-error"
          role="alert"
          className="rounded-md bg-red-50 p-4"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button - WCAG 2.1 AA: min-h-[44px] for touch target */}
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 min-h-[44px] text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loginMutation.isPending ? 'Wird angemeldet...' : 'Anmelden'}
      </button>

      {/* Link to Registration */}
      <p className="mt-4 text-center text-sm text-gray-600">
        Noch kein Konto?{' '}
        <a
          href="/register"
          className="font-medium text-primary-600 hover:text-primary-500"
        >
          Jetzt registrieren
        </a>
      </p>
    </form>
  );
}
