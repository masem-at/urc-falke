import { SetPasswordForm } from '../features/onboarding';

// ============================================================================
// SET PASSWORD PAGE (/onboard-existing/set-password)
// ============================================================================
//
// ARCHITECTURE NOTE: Password setting page for Track A onboarding
// - User has been auto-logged in via token
// - Must set a new password to continue
// - Redirects to complete-profile on success
//
// ============================================================================

export function SetPasswordPage() {
  const handleSuccess = () => {
    // Redirect to profile completion page
    window.location.href = '/onboard-existing/complete-profile';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">URC</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Passwort festlegen
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Willkommen beim USV Falkensteiner Radclub!<br />
          Bitte lege ein sicheres Passwort fest.
        </p>

        {/* Progress indicator */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm text-gray-500">QR-Code</span>
            </div>
            <div className="w-8 h-0.5 bg-primary-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm text-gray-900 font-medium">Passwort</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm text-gray-500">Profil</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SetPasswordForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}
