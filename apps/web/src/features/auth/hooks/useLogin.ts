import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, ApiError, type LoginInput, type LoginResponse } from '../../../lib/api';

// ============================================================================
// useLogin Hook (TanStack Query)
// ============================================================================
//
// ARCHITECTURE NOTE: Login mutation with Two-Track Onboarding support
// - Returns mustChangePassword flag for Track A users
// - Caller is responsible for redirecting if mustChangePassword is true
// - Invalidates 'auth' query on success to refetch user state
//
// ============================================================================

export interface UseLoginOptions {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: ApiError) => void;
}

export function useLogin(options: UseLoginOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
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
