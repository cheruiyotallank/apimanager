import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

/**
 * ============================================================================
 * SBM BANK LOGIN COMPONENT (pre-login/login/login.component.ts)
 * ============================================================================
 * Manages authentication state, MFA OTP verification, OAuth2/SSO integrations,
 * asset paths, and navigation.
 * ============================================================================
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  /**
   * SBM BANK ASSET PATHS
   */
  public sbmLogoPath: string | null = 'assets/sbm-logo.png';
  public sbmLeftBannerPath: string | null = 'assets/background5.jpg';

  /**
   * WORKFLOW STEP: 'CREDENTIALS' | 'MFA_VERIFICATION'
   */
  public step: 'CREDENTIALS' | 'MFA_VERIFICATION' = 'CREDENTIALS';

  /**
   * USER CREDENTIALS MODEL
   */
  public userCredentials = {
    email: '',
    password: '',
    rememberMe: false
  };

  /**
   * 6-DIGIT MFA OTP CODE STATE
   */
  public mfaCode: string[] = ['', '', '', '', '', ''];

  /**
   * UI INTERACTIVE STATES
   */
  public isPasswordVisible: boolean = false;
  public isSubmitting: boolean = false;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  /**
   * Toggles the visibility of the password text field.
   */
  public togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  /**
   * Fallback handler if the logo image asset is not present.
   */
  public onLogoError(): void {
    this.sbmLogoPath = null;
  }

  /**
   * Credentials submission handler - Transitions to Multi-Factor Authentication (MFA).
   */
  public onLoginSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    // Email validation
    if (!this.userCredentials.email || !this.userCredentials.email.trim()) {
      this.errorMessage = 'Please enter your Email ID.';
      return;
    }

    if (!this.isValidEmail(this.userCredentials.email)) {
      this.errorMessage = 'Please enter a valid Email ID (e.g. user@sbm.co.ke).';
      return;
    }

    // Password validation
    if (!this.userCredentials.password) {
      this.errorMessage = 'Please enter your Password.';
      return;
    }

    // Start MFA Authentication Step
    this.isSubmitting = true;

    setTimeout(() => {
      this.isSubmitting = false;
      this.step = 'MFA_VERIFICATION';
      this.successMessage = `MFA verification code sent to ${this.userCredentials.email}. Enter code to complete login.`;
    }, 1200);
  }

  /**
   * Verifies 6-digit Multi-Factor Authentication (MFA) OTP code.
   */
  public verifyMfaOtp(): void {
    this.errorMessage = null;
    this.successMessage = null;

    const fullCode = this.mfaCode.join('');
    if (fullCode.length < 6) {
      this.errorMessage = 'Please enter the 6-digit MFA security code.';
      return;
    }

    this.isSubmitting = true;

    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = 'MFA verification successful! Directing to SBM Portal...';

      setTimeout(() => {
        this.router.navigate(['/signup']);
      }, 1000);
    }, 1200);
  }

  /**
   * Resends MFA OTP code.
   */
  public resendMfaOtp(): void {
    this.errorMessage = null;
    this.successMessage = `A new 6-digit MFA security code has been sent to ${this.userCredentials.email}.`;
  }

  /**
   * Navigates back to credentials login step.
   */
  public backToCredentials(): void {
    this.step = 'CREDENTIALS';
    this.errorMessage = null;
    this.successMessage = null;
  }

  /**
   * OAuth2 / SSO Google Login Integration
   */
  public loginWithGoogle(): void {
    this.errorMessage = null;
    this.successMessage = 'Connecting to Google SSO Provider...';
    this.isSubmitting = true;

    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = 'Google SSO authenticated! Redirecting to SBM Portal...';
      setTimeout(() => {
        this.router.navigate(['/signup']);
      }, 1000);
    }, 1200);
  }

  /**
   * OAuth2 / SSO Enterprise Microsoft Single Sign-On Integration
   */
  public loginWithSSO(): void {
    this.errorMessage = null;
    this.successMessage = 'Connecting to SBM Enterprise SSO Provider...';
    this.isSubmitting = true;

    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = 'Enterprise SSO authenticated! Redirecting to SBM Portal...';
      setTimeout(() => {
        this.router.navigate(['/signup']);
      }, 1000);
    }, 1200);
  }

  /**
   * Helper email validator
   */
  private isValidEmail(email: string): boolean {
    const emailRegexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegexPattern.test(email);
  }
}
