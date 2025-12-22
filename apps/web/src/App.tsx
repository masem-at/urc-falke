import { LoginPage } from './routes';

// ============================================================================
// APP COMPONENT (Simple URL-based Routing)
// ============================================================================
//
// ARCHITECTURE NOTE: Simple routing until TanStack Router is fully configured
// - /login: Login page
// - /: Home page (shows welcome message)
//
// TODO: Replace with TanStack Router file-based routing in Story 1.4+
//
// ============================================================================

export function App() {
  const path = window.location.pathname;

  // Login page
  if (path === '/login') {
    return <LoginPage />;
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
          Story 1.3 - User Login & Session Management
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
