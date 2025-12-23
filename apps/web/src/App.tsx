import { LoginPage, OnboardTokenPage, SetPasswordPage, CompleteProfilePage, DashboardPage } from './routes';

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

  // Home/Dashboard page (default)
  // Dashboard checks auth and redirects to /login if not authenticated
  return <DashboardPage />;
}
