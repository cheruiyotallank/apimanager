import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import {
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  EmailOtpVerifyRequest,
  MfaOtpVerifyRequest,
  PasswordResetRequest,
  ForceChangePasswordRequest,
  AuthResponse,
  ApiResponse,
  UserProfile
} from '../models/auth.models';

/**
 * ============================================================================
 * SBM BANK AUTHENTICATION SERVICE (core/services/auth.service.ts)
 * ============================================================================
 * Handles REST API endpoints for user authentication, developer registration,
 * 6-digit email OTP verification, 6-digit MFA verification, force password change,
 * password reset, and JWT local session storage.
 * ============================================================================
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly tokenKey: string = 'sbm_auth_token';
  private readonly userKey: string = 'sbm_user_profile';

  constructor(private apiService: ApiService) { }

  /**
   * Submits user credentials for login authentication.
   */
  public login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.apiService.post<ApiResponse<AuthResponse>>('/auth/login', credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.saveSession(response.data);
          }
        })
      );
  }

  /**
   * Submits developer profile registration.
   */
  public register(payload: RegisterRequest): Observable<ApiResponse<RegisterResponse>> {
    return this.apiService.post<ApiResponse<RegisterResponse>>('/auth/register', payload);
  }

  /**
   * Verifies 6-digit Email OTP verification code.
   */
  public verifyEmailOtp(payload: EmailOtpVerifyRequest): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>('/auth/verify-email', payload);
  }

  /**
   * Submits Force Change Password (Old Password, New Password, Confirm New Password).
   */
  public forceChangePassword(payload: ForceChangePasswordRequest): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>('/auth/change-password', payload);
  }

  /**
   * Verifies 6-digit MFA security OTP code.
   */
  public verifyMfaOtp(payload: MfaOtpVerifyRequest): Observable<ApiResponse<AuthResponse>> {
    return this.apiService.post<ApiResponse<AuthResponse>>('/auth/verify-mfa', payload)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.saveSession(response.data);
          }
        })
      );
  }

  /**
   * Requests a password reset link for forgotten password.
   */
  public requestPasswordReset(payload: PasswordResetRequest): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>('/auth/forgot-password', payload);
  }

  /**
   * Resends Email or MFA OTP code.
   */
  public resendOtp(email: string, type: 'EMAIL' | 'MFA'): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>('/auth/resend-otp', { email, type });
  }

  /**
   * Stores JWT authentication token and user profile in local storage.
   */
  public saveSession(authResponse: AuthResponse): void {
    if (authResponse.accessToken) {
      localStorage.setItem(this.tokenKey, authResponse.accessToken);
    }
    if (authResponse.user) {
      localStorage.setItem(this.userKey, JSON.stringify(authResponse.user));
    }
  }

  /**
   * Retrieves active JWT token.
   */
  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Retrieves active User Profile.
   */
  public getUser(): UserProfile | null {
    const userJson = localStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Checks if user has an active session token.
   */
  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Clears session storage and logs out user.
   */
  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
}
