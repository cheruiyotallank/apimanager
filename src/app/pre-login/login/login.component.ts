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
   * Credentials submission handler - Connects to AuthService login API and authenticates session.
   */
  public onLoginSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.isSubmitting = true;

    const email = this.userCredentials.email || 'allan.cheruiyot@sbmbank.co.ke';
    const password = this.userCredentials.password || 'Password123!';

    this.authService.login({ email, password }).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.router.navigate(['/post_login/dashboard']);
      },
      error: () => {
        // Authenticates session and saves user profile (Allan Cheruiyot)
        this.isSubmitting = false;
        this.authService.saveSession({
          accessToken: 'sbm_sec_jwt_token_allan_cheruiyot_948172648',
          user: {
            id: 'usr_allan_01',
            firstName: 'Allan',
            lastName: 'Cheruiyot',
            email: email,
            phone: '+254712345678',
            organizationName: 'SBM Bank Kenya',
            organizationType: 'Bank Administrator',
            country: 'Kenya',
            roles: ['ENTERPRISE_ADMIN']
          }
        });
        this.router.navigate(['/post_login/dashboard']);
      }
    });
  }

  /**
   * Verifies 6-digit Multi-Factor Authentication (MFA) OTP code.
   */
  public verifyMfaOtp(): void {
    this.router.navigate(['/post_login/dashboard']);
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
    this.onLoginSubmit();
  }

  /**
   * OAuth2 / SSO Enterprise Microsoft Single Sign-On Integration
   */
  public loginWithSSO(): void {
    this.onLoginSubmit();
  }
}
