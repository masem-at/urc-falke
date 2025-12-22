import { useState } from 'react';
import { useCompleteProfile } from '../hooks';
import type { ApiError } from '../../../lib/api';

// ============================================================================
// PROFILE COMPLETE FORM
// ============================================================================
//
// ARCHITECTURE NOTE: Profile completion for Track A onboarding
// - Optional fields: firstName, lastName, profileImageUrl
// - Can be skipped entirely
// - Triggers confetti animation on success
//
// ============================================================================

export interface ProfileCompleteFormProps {
  initialFirstName?: string | null;
  initialLastName?: string | null;
  onSuccess: (showConfetti: boolean) => void;
}

export function ProfileCompleteForm({
  initialFirstName,
  initialLastName,
  onSuccess,
}: ProfileCompleteFormProps) {
  const [firstName, setFirstName] = useState(initialFirstName || '');
  const [lastName, setLastName] = useState(initialLastName || '');
  const [error, setError] = useState<string | null>(null);

  const completeProfileMutation = useCompleteProfile({
    onSuccess: (data) => {
      onSuccess(data.showConfetti);
    },
    onError: (apiError: ApiError) => {
      setError(apiError.problem.detail);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    completeProfileMutation.mutate({
      firstName: firstName || undefined,
      lastName: lastName || undefined,
    });
  };

  const handleSkip = () => {
    // Complete with no changes
    completeProfileMutation.mutate({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* First Name */}
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
          Vorname
        </label>
        <div className="mt-1">
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Dein Vorname"
          />
        </div>
      </div>

      {/* Last Name */}
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
          Nachname
        </label>
        <div className="mt-1">
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Dein Nachname"
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col space-y-3">
        <button
          type="submit"
          disabled={completeProfileMutation.isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {completeProfileMutation.isPending ? 'Wird gespeichert...' : 'Profil speichern'}
        </button>
        <button
          type="button"
          onClick={handleSkip}
          disabled={completeProfileMutation.isPending}
          className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Überspringen
        </button>
      </div>
    </form>
  );
}
