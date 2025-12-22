import { useQuery } from '@tanstack/react-query';
import { authApi, ApiError, type AuthUser } from '../../../lib/api';

// ============================================================================
// useAuth Hook (TanStack Query)
// ============================================================================
//
// ARCHITECTURE NOTE: Get current authenticated user
// - Returns user info if authenticated
// - Returns null if not authenticated (401)
// - Handles 403 (must change password) separately
//
// ============================================================================

export interface UseAuthResult {
  user: AuthUser | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  isAuthenticated: boolean;
  mustChangePassword: boolean;
}

export function useAuth(): UseAuthResult {
  const query = useQuery({
    queryKey: ['auth'],
    queryFn: authApi.me,
    retry: false, // Don't retry on 401
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Check if error is 401 (not authenticated)
  const isNotAuthenticated =
    query.error instanceof ApiError && query.error.status === 401;

  // Check if error is 403 (must change password)
  const mustChangePassword =
    query.error instanceof ApiError && query.error.status === 403;

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError && !isNotAuthenticated && !mustChangePassword,
    error: query.error instanceof ApiError ? query.error : null,
    isAuthenticated: !!query.data && !mustChangePassword,
    mustChangePassword,
  };
}
