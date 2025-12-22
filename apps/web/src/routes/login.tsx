import { LoginForm } from '../features/auth';

// ============================================================================
// LOGIN PAGE
// ============================================================================
//
// ARCHITECTURE NOTE: Login page for both Track A and Track B users
// - Track A (pre-seeded): may need to change password after login
// - Track B (new registrations): normal login flow
//
// TWO-TRACK ONBOARDING:
// - If mustChangePassword is true, redirect to /onboard-existing/set-password
// - Otherwise, redirect to home page
//
// ============================================================================

export function LoginPage() {
  const handleSuccess = () => {
    // Redirect to home page after successful login
    window.location.href = '/';
  };

  const handleMustChangePassword = () => {
    // Track A user: redirect to password change page
    window.location.href = '/onboard-existing/set-password';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">URC</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Anmelden
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Willkommen beim USV Falkensteiner Radclub
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm
            onSuccess={handleSuccess}
            onMustChangePassword={handleMustChangePassword}
          />
        </div>
      </div>
    </div>
  );
}
