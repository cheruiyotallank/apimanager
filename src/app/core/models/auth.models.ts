/**
 * ============================================================================
 * SBM BANK AUTHENTICATION DATA MODELS (core/models/auth.models.ts)
 * ============================================================================
 * Strongly-typed DTO interfaces defining JSON payloads for backend REST API communication.
 * ============================================================================
 */

/**
 * Standard generic API wrapper response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
  timestamp?: string;
  isFirstTimeLogin?: boolean;
  forcePasswordChange?: boolean;
}

/**
 * Login credentials request payload
 */
export interface LoginRequest {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

/**
 * Account Registration request payload
 */
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organizationName: string;
  organizationType: string;
  country: string;
  acceptTerms: boolean;
}

/**
 * Registration response payload
 */
export interface RegisterResponse {
  userId: string;
  email: string;
  verificationRequired: boolean;
  message: string;
}

/**
 * 6-Digit Email OTP verification request payload
 */
export interface EmailOtpVerifyRequest {
  email: string;
  otpCode: string;
}

/**
 * 6-Digit MFA OTP verification request payload
 */
export interface MfaOtpVerifyRequest {
  email: string;
  otpCode: string;
}

/**
 * Password Reset request payload
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Force Change Password request payload (First-time user password setup)
 */
export interface ForceChangePasswordRequest {
  email: string;
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}


/**
 * Authentication Token & Session payload
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
  isFirstTimeLogin?: boolean;
  forcePasswordChange?: boolean;
  user: UserProfile;
}

/**
 * Authenticated User Profile payload
 */
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organizationName: string;
  organizationType: string;
  country: string;
  roles: string[];
  apiKey?: string;
}
