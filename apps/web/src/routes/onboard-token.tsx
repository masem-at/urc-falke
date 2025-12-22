import { useEffect, useState } from 'react';
import { useOnboardExisting } from '../features/onboarding';
import type { ApiError } from '../lib/api';

// ============================================================================
// ONBOARD TOKEN PAGE (/einladung/:token)
// ============================================================================
//
// ARCHITECTURE NOTE: Token validation page for Track A onboarding
// - Extracts token from URL path
// - Auto-submits token for validation
// - Redirects to set-password on success
// - Shows error page on failure
//
// TOKEN ERROR HANDLING:
// - 404: Token not found → "Ungültiger Aktivierungscode"
// - 410: Token expired → "Aktivierungscode abgelaufen"
// - 409: Token already used → "Account bereits aktiviert"
//
// ============================================================================

export function OnboardTokenPage() {
  const [error, setError] = useState<{ status: number; message: string } | null>(null);

  // Extract token from URL
  const pathParts = window.location.pathname.split('/');
  const token = pathParts[pathParts.length - 1];

  const onboardMutation = useOnboardExisting({
    onSuccess: (data) => {
      // Redirect to set-password page
      window.location.href = data.redirectTo;
    },
    onError: (apiError: ApiError) => {
      setError({
        status: apiError.status,
        message: apiError.problem.detail,
      });
    },
  });

  // Auto-submit token on mount
  useEffect(() => {
    if (token && token !== 'einladung') {
      onboardMutation.mutate(token);
    }
  }, [token]);

  // Loading state
  if (onboardMutation.isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <span className="text-white text-2xl font-bold">URC</span>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Aktivierungscode wird geprüft...
          </h2>
          <p className="mt-2 text-gray-600">
            Bitte warten.
          </p>
        </div>
      </div>
    );
  }

  // Error states
  if (error) {
    let title = 'Fehler';
    let icon = '❌';
    let actionText = 'Zurück zur Startseite';
    let actionUrl = '/';

    if (error.status === 404) {
      title = 'Ungültiger Aktivierungscode';
      icon = '🔍';
    } else if (error.status === 410) {
      title = 'Aktivierungscode abgelaufen';
      icon = '⏰';
    } else if (error.status === 409) {
      title = 'Account bereits aktiviert';
      icon = '✓';
      actionText = 'Zum Login';
      actionUrl = '/login';
    }

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">{icon}</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            {title}
          </h2>
          <p className="mt-2 text-center text-gray-600">
            {error.message}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <a
              href={actionUrl}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {actionText}
            </a>
            {error.status !== 409 && (
              <p className="mt-4 text-center text-sm text-gray-500">
                Bei Fragen kontaktiere uns unter{' '}
                <a href="mailto:info@urc-falke.at" className="text-primary-600 hover:text-primary-500">
                  info@urc-falke.at
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // No token provided
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-4xl">❓</span>
        </div>
        <h2 className="mt-6 text-2xl font-bold text-gray-900">
          Kein Aktivierungscode
        </h2>
        <p className="mt-2 text-gray-600">
          Bitte scanne den QR-Code auf deinem Einladungsbrief.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-500"
          >
            Zur Startseite
          </a>
        </div>
      </div>
    </div>
  );
}
