import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../config/api-endpoints.config';
import {
  LoginRequest,
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
 * password reset, and JWT local session storage using centralized endpoints config.
 * ============================================================================
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly tokenKey: string = 'sbm_auth_token';
  private readonly userKey: string = 'sbm_user_profile';
  private successMessageSubject = new BehaviorSubject<string | null>(null);
  private successMessageTimeout: any = null;

  constructor(private apiService: ApiService) { }

  /**
   * Submits user credentials for login authentication.
   */
  public login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.apiService.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.LOGIN, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.saveSession(response.data);
          }
        })
      );
  }

  /**
   * Submits Force Change Password (Old Password, New Password, Confirm New Password).
   */
  public forceChangePassword(payload: ForceChangePasswordRequest): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, payload);
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

  /**
   * Sets success message and auto-clears after 5 seconds
   */
  public setSuccessMessage(message: string): void {
    this.successMessageSubject.next(message);
    if (this.successMessageTimeout) {
      clearTimeout(this.successMessageTimeout);
    }
    this.successMessageTimeout = setTimeout(() => {
      this.successMessageSubject.next(null);
    }, 5000);
  }

  /**
   * Gets current success message as Observable
   */
  public getSuccessMessage(): Observable<string | null> {
    return this.successMessageSubject.asObservable();
  }

  /**
   * Gets current success message value synchronously
   */
  public getSuccessMessageValue(): string | null {
    return this.successMessageSubject.value;
  }

  /**
   * Clears success message manually
   */
  public clearSuccessMessage(): void {
    this.successMessageSubject.next(null);
    if (this.successMessageTimeout) {
      clearTimeout(this.successMessageTimeout);
      this.successMessageTimeout = null;
    }
  }
}
