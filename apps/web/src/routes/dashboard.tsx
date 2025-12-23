import { useEffect, useState } from 'react';
import { authApi, type AuthUser, ApiError } from '../lib/api';

// ============================================================================
// DASHBOARD PAGE
// ============================================================================
//
// ARCHITECTURE NOTE: Simple dashboard showing authenticated user info
// - Shows user details after successful login
// - Provides logout functionality
// - Redirects to login if not authenticated
//
// ============================================================================

export function DashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch current user on mount
    const fetchUser = async () => {
      try {
        const userData = await authApi.me();
        setUser(userData);
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 401) {
            // Not authenticated, redirect to login
            window.location.href = '/login';
            return;
          }
          if (err.status === 403 && err.redirectTo) {
            // Must change password, redirect accordingly
            window.location.href = err.redirectTo;
            return;
          }
        }
        setError('Fehler beim Laden der Benutzerdaten');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
      // Force redirect even if logout fails
      window.location.href = '/login';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lädt...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="mt-4 text-primary-600 hover:text-primary-500"
          >
            Zur Anmeldung
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">URC</span>
            </div>
            <h1 className="ml-3 text-2xl font-bold text-gray-900">URC Falke</h1>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Abmelden
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Willkommen! 👋
            </h2>

            {/* User Info */}
            <div className="space-y-4">
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Deine Informationen
                </h3>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Benutzer-ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.userId}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Rolle</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user.role === 'admin' ? 'Administrator' : 'Mitglied'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Onboarding-Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user.onboardingStatus === 'completed' ? '✓ Abgeschlossen' : user.onboardingStatus}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Status Message */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  ✓ Du bist erfolgreich angemeldet!
                </p>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Entwicklungsstatus
                </h4>
                <p className="text-sm text-blue-800">
                  Dies ist eine frühe Version der URC Falke PWA. Die folgenden Features sind verfügbar:
                </p>
                <ul className="mt-2 text-sm text-blue-800 list-disc list-inside space-y-1">
                  <li>✓ Benutzerregistrierung</li>
                  <li>✓ Login & Session Management</li>
                  <li>✓ QR-Code Onboarding für bestehende Mitglieder</li>
                  <li>✓ USV Mitgliedsnummer-Verifizierung (Backend)</li>
                </ul>
                <p className="mt-3 text-sm text-blue-800">
                  Weitere Features folgen in den nächsten Stories...
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
