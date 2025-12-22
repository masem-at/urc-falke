import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, ApiError, type CompleteProfileInput, type CompleteProfileResponse } from '../../../lib/api';

// ============================================================================
// useCompleteProfile Hook (TanStack Query)
// ============================================================================
//
// ARCHITECTURE NOTE: Profile completion for Track A users during onboarding
// - Optional profile updates (firstName, lastName, profileImageUrl)
// - Updates onboarding_status: password_changed → completed
// - Returns showConfetti flag for celebration animation
//
// ============================================================================

export interface UseCompleteProfileOptions {
  onSuccess?: (data: CompleteProfileResponse) => void;
  onError?: (error: ApiError) => void;
}

export function useCompleteProfile(options: UseCompleteProfileOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CompleteProfileInput) => userApi.completeProfile(input),
    onSuccess: (data) => {
      // Invalidate auth query to refetch current user
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      options.onSuccess?.(data);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        options.onError?.(error);
      }
    },
  });
}
