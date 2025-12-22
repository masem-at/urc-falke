import { LoginPage, OnboardTokenPage, SetPasswordPage, CompleteProfilePage } from './routes';

// ============================================================================
// APP COMPONENT (Simple URL-based Routing)
// ============================================================================
//
// ARCHITECTURE NOTE: Simple routing until TanStack Router is fully configured
// - /login: Login page
// - /einladung/:token: QR code onboarding (Track A)
// - /onboard-existing/set-password: Password setting (Track A)
// - /onboard-existing/complete-profile: Profile completion (Track A)
// - /: Home page (shows welcome message)
//
// TODO: Replace with TanStack Router file-based routing in future stories
//
// ============================================================================

export function App() {
  const path = window.location.pathname;

  // Login page
  if (path === '/login') {
    return <LoginPage />;
  }

  // Onboard token page (Track A: QR code scan)
  if (path.startsWith('/einladung/')) {
    return <OnboardTokenPage />;
  }

  // Set password page (Track A: after QR scan)
  if (path === '/onboard-existing/set-password') {
    return <SetPasswordPage />;
  }

  // Complete profile page (Track A: final step)
  if (path === '/onboard-existing/complete-profile') {
    return <CompleteProfilePage />;
  }

  // Home page (default)
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary-700 mb-4">
          URC Falke
        </h1>
        <p className="text-gray-600">
          USV Falkensteiner Radclub Event-Management PWA
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Story 1.4a - QR-Code Onboarding für bestehende Mitglieder
        </p>
        <div className="mt-6">
          <a
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Anmelden
          </a>
        </div>
      </div>
    </div>
  );
}
