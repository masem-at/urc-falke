import { useState } from 'react';
import { ProfileCompleteForm, Confetti } from '../features/onboarding';

// ============================================================================
// COMPLETE PROFILE PAGE (/onboard-existing/complete-profile)
// ============================================================================
//
// ARCHITECTURE NOTE: Profile completion page for Track A onboarding
// - Final step of onboarding
// - Optional profile updates
// - Shows confetti animation on success
// - Redirects to home page after celebration
//
// ============================================================================

export function CompleteProfilePage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSuccess = (confetti: boolean) => {
    if (confetti) {
      setShowConfetti(true);
    }
    setIsComplete(true);

    // Redirect to home after confetti animation
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  };

  // Show success state with confetti
  if (isComplete) {
    return (
      <>
        {showConfetti && <Confetti />}
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-4xl">✓</span>
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Willkommen beim URC Falke!
            </h2>
            <p className="mt-2 text-gray-600">
              Dein Account wurde erfolgreich aktiviert.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Du wirst gleich weitergeleitet...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">URC</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Fast geschafft!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Optional: Vervollständige dein Profil
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
            <div className="w-8 h-0.5 bg-green-500"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm text-gray-500">Passwort</span>
            </div>
            <div className="w-8 h-0.5 bg-primary-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm text-gray-900 font-medium">Profil</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <ProfileCompleteForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}
