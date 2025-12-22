// ============================================================================
// API CLIENT
// ============================================================================
//
// ARCHITECTURE NOTE: Fetch-based API client with credentials
// - Uses fetch with credentials: 'include' for HttpOnly cookie support
// - API_URL defaults to localhost:3000 for development
// - Content-Type: application/json for all requests
//
// ============================================================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * RFC 7807 Problem Details error format
 */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  errors?: Array<{ path: string[]; message: string }>;
  redirectTo?: string;
}

/**
 * API error class that wraps RFC 7807 Problem Details
 */
export class ApiError extends Error {
  constructor(
    public readonly problem: ProblemDetails
  ) {
    super(problem.detail);
    this.name = 'ApiError';
  }

  get status(): number {
    return this.problem.status;
  }

  get redirectTo(): string | undefined {
    return this.problem.redirectTo;
  }
}

/**
 * Generic fetch wrapper with JSON handling and error transformation
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    credentials: 'include', // CRITICAL: Send cookies with requests
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  // Handle non-JSON responses
  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    if (!response.ok) {
      throw new ApiError({
        type: 'https://urc-falke.app/errors/network-error',
        title: 'Netzwerkfehler',
        status: response.status,
        detail: 'Unerwartete Serverantwort',
      });
    }
    return {} as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data as ProblemDetails);
  }

  return data as T;
}

// ============================================================================
// AUTH API
// ============================================================================

export interface LoginInput {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  onboarding_status: string | null;
  usv_number: string | null;
  is_founding_member: boolean | null;
  is_usv_verified: boolean | null;
  profile_image_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface LoginResponse {
  user: UserResponse;
  mustChangePassword: boolean;
}

export interface AuthUser {
  userId: number;
  role: 'member' | 'admin';
  mustChangePassword: boolean;
  onboardingStatus: string;
}

export const authApi = {
  /**
   * Login with email and password
   * Sets JWT cookie automatically
   */
  login: (input: LoginInput): Promise<LoginResponse> => {
    return apiFetch<LoginResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  /**
   * Logout and clear JWT cookie
   */
  logout: (): Promise<{ message: string }> => {
    return apiFetch<{ message: string }>('/api/v1/auth/logout', {
      method: 'POST',
    });
  },

  /**
   * Get current authenticated user
   * Returns 401 if not authenticated
   * Returns 403 if must change password (Track A users)
   */
  me: (): Promise<AuthUser> => {
    return apiFetch<AuthUser>('/api/v1/auth/me', {
      method: 'GET',
    });
  },

  /**
   * Onboard existing member with QR code token (Track A)
   * Sets JWT cookie automatically
   */
  onboardExisting: (token: string): Promise<OnboardExistingResponse> => {
    return apiFetch<OnboardExistingResponse>('/api/v1/auth/onboard-existing', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },
};

// ============================================================================
// USER API (Profile and Password Management)
// ============================================================================

export interface SetPasswordInput {
  password: string;
}

export interface SetPasswordResponse {
  user: UserResponse;
  redirectTo: string;
}

export interface CompleteProfileInput {
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

export interface CompleteProfileResponse {
  user: UserResponse;
  showConfetti: boolean;
}

export interface OnboardExistingResponse {
  user: UserResponse;
  redirectTo: string;
}

export const userApi = {
  /**
   * Set password for Track A user during onboarding
   * Requires authentication (even with must_change_password=true)
   */
  setPassword: (input: SetPasswordInput): Promise<SetPasswordResponse> => {
    return apiFetch<SetPasswordResponse>('/api/v1/users/me/set-password', {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  /**
   * Complete profile for Track A user during onboarding
   * Requires authentication
   */
  completeProfile: (input: CompleteProfileInput): Promise<CompleteProfileResponse> => {
    return apiFetch<CompleteProfileResponse>('/api/v1/users/me/complete-profile', {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },
};

// ============================================================================
// USV VERIFICATION API
// ============================================================================

export interface USVVerificationResponse {
  valid: boolean;
  memberSince?: string;
}

export const usvApi = {
  /**
   * Verify a USV membership number
   * Requires authentication
   * Rate limited: 5 requests per minute
   */
  verify: (usvNumber: string): Promise<USVVerificationResponse> => {
    return apiFetch<USVVerificationResponse>('/api/v1/usv/verify', {
      method: 'POST',
      body: JSON.stringify({ usvNumber }),
    });
  },
};
