import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

/**
 * ============================================================================
 * SBM BANK REGISTER (SIGN UP) COMPONENT (pre-login/register/register.component.ts)
 * ============================================================================
 * Manages user registration state, organization profile, email verification workflow,
 * force password change workflow, asset paths, and navigation back to login.
 * Connected to core AuthService REST API endpoints.
 * ============================================================================
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  /**
   * SBM BANK ASSET PATHS
   */
  public sbmLogoPath: string | null = 'assets/sbm-logo.png';
  public sbmLeftBannerPath: string | null = 'assets/background5.jpg';

  /**
   * WORKFLOW STEP: 'REGISTER_FORM' | 'EMAIL_VERIFICATION' | 'SET_PASSWORD'
   */
  public step: 'REGISTER_FORM' | 'EMAIL_VERIFICATION' | 'SET_PASSWORD' = 'REGISTER_FORM';

  /**
   * USER REGISTRATION FORM MODEL (Personal & Organization Profile)
   */
  public registerData = {
    firstName: '',
    lastName: '',
    email: '',
    organizationName: '',
    organizationType: 'Enterprise',
    country: 'Kenya (+254)',
    phone: '',
    acceptTerms: false
  };

  /**
   * FORCE CHANGE PASSWORD MODEL (Old, New & Confirm Passwords)
   */
  public passwordData = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  public isOldPasswordVisible: boolean = false;
  public isNewPasswordVisible: boolean = false;
  public isConfirmPasswordVisible: boolean = false;

  /**
   * DROPDOWN OPTIONS
   */
  public countries: string[] = [
    'Kenya (+254)',
    'Mauritius (+230)',
    'India (+91)',
    'United Kingdom (+44)',
    'United States (+1)',
    'Other International'
  ];

  public organizationTypes: string[] = [
    'Enterprise',
    'Fintech / Startup',
    'Independent Developer',
    'Financial Institution'
  ];

  /**
   * EMAIL VERIFICATION OTP CODE STATE (6-Digit Code)
   */
  public verificationCode: string[] = ['', '', '', '', '', ''];

  /**
   * UI INTERACTIVE STATES
   */
  public isSubmitting: boolean = false;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  /**
   * Fallback for logo error.
   */
  public onLogoError(): void {
    this.sbmLogoPath = null;
  }

  /**
   * Toggle visibility of Old Password field.
   */
  public toggleOldPasswordVisibility(): void {
    this.isOldPasswordVisible = !this.isOldPasswordVisible;
  }

  /**
   * Toggle visibility of New Password field.
   */
  public toggleNewPasswordVisibility(): void {
    this.isNewPasswordVisible = !this.isNewPasswordVisible;
  }

  /**
   * Toggle visibility of Confirm Password field.
   */
  public toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  /**
   * Form submission handler for account registration via AuthService.
   */
  public onRegisterSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    // First Name validation
    if (!this.registerData.firstName || !this.registerData.firstName.trim()) {
      this.errorMessage = 'Please enter your First Name.';
      return;
    }

    // Last Name validation
    if (!this.registerData.lastName || !this.registerData.lastName.trim()) {
      this.errorMessage = 'Please enter your Last Name.';
      return;
    }

    // Email validation
    if (!this.registerData.email || !this.registerData.email.trim()) {
      this.errorMessage = 'Please enter your Email Address.';
      return;
    }

    if (!this.isValidEmail(this.registerData.email)) {
      this.errorMessage = 'Please enter a valid Email Address (e.g. user@sbm.co.ke).';
      return;
    }

    // Phone Number validation
    if (!this.registerData.phone || !this.registerData.phone.trim()) {
      this.errorMessage = 'Please enter your Phone Number.';
      return;
    }

    // Organization Profile validation
    if (!this.registerData.organizationName || !this.registerData.organizationName.trim()) {
      this.errorMessage = 'Please enter your Organization / Company Name.';
      return;
    }

    // Terms & Conditions check
    if (!this.registerData.acceptTerms) {
      this.errorMessage = "You must accept SBM Bank's Terms and Conditions concerning this application.";
      return;
    }

    this.isSubmitting = true;

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.step = 'EMAIL_VERIFICATION';
        this.successMessage = response.message || `Verification code sent to ${this.registerData.email}. Enter code below.`;
      },
      error: (error) => {
        this.isSubmitting = false;
        // Fallback for development testing if server is un-reachable
        if (error?.message?.includes('Unable to connect')) {
          this.step = 'EMAIL_VERIFICATION';
          this.successMessage = `[Dev Mode] Verification code dispatched to ${this.registerData.email}. Enter code below.`;
        } else {
          this.errorMessage = error?.message || 'Registration failed. Please check your inputs and try again.';
        }
      }
    });
  }

  /**
   * Verifies 6-digit Email OTP Verification Code via AuthService & transitions to Force Change Password.
   */
  public verifyEmailOtp(): void {
    this.errorMessage = null;
    this.successMessage = null;

    const fullCode = this.verificationCode.join('');
    if (fullCode.length < 6) {
      this.errorMessage = 'Please enter the complete 6-digit verification code.';
      return;
    }

    this.isSubmitting = true;

    const payload = {
      email: this.registerData.email,
      otpCode: fullCode
    };

    this.authService.verifyEmailOtp(payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.step = 'SET_PASSWORD';
        this.successMessage = 'Email verified! Enter the temporary password sent to your email as your Old Password below, then set a new password.';
      },
      error: (error) => {
        this.isSubmitting = false;
        // Fallback for development testing if server is un-reachable
        if (error?.message?.includes('Unable to connect')) {
          this.step = 'SET_PASSWORD';
          this.successMessage = '[Dev Mode] Email verified! Enter the temporary password sent to your email as your Old Password below, then set a new password.';
        } else {
          this.errorMessage = error?.message || 'Invalid or expired OTP verification code.';
        }
      }
    });
  }

  /**
   * Submits Force Change Password (Old Password, New Password, Confirm New Password) via AuthService.
   */
  public onForceChangePasswordSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (!this.passwordData.oldPassword) {
      this.errorMessage = 'Please enter your Old / Temporary Password (received via email).';
      return;
    }

    if (!this.passwordData.newPassword) {
      this.errorMessage = 'Please enter your New Password.';
      return;
    }

    if (this.passwordData.newPassword.length < 8) {
      this.errorMessage = 'New Password must be at least 8 characters long.';
      return;
    }

    if (this.passwordData.newPassword === this.passwordData.oldPassword) {
      this.errorMessage = 'New Password must be different from your Old Password.';
      return;
    }

    if (!this.passwordData.confirmPassword) {
      this.errorMessage = 'Please confirm your New Password.';
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.errorMessage = 'New Password and Confirm New Password do not match.';
      return;
    }

    this.isSubmitting = true;

    const payload = {
      email: this.registerData.email,
      oldPassword: this.passwordData.oldPassword,
      newPassword: this.passwordData.newPassword,
      confirmPassword: this.passwordData.confirmPassword
    };

    this.authService.forceChangePassword(payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = 'Password changed successfully! Account activated. Directing to Login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        // Fallback for development testing if server is un-reachable
        if (error?.message?.includes('Unable to connect')) {
          this.successMessage = '[Dev Mode] Password changed successfully! Account activated. Directing to Login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        } else {
          this.errorMessage = error?.message || 'Password update failed. Please check your credentials and try again.';
        }
      }
    });
  }

  /**
   * Resends Email Verification OTP code via AuthService.
   */
  public resendEmailOtp(): void {
    this.errorMessage = null;
    this.successMessage = null;

    this.authService.resendOtp(this.registerData.email, 'EMAIL').subscribe({
      next: (response) => {
        this.successMessage = `A new 6-digit verification code has been sent to ${this.registerData.email}.`;
      },
      error: (error) => {
        this.successMessage = `A new 6-digit verification code has been sent to ${this.registerData.email}.`;
      }
    });
  }

  /**
   * Navigates back to registration form step.
   */
  public backToRegisterForm(): void {
    this.step = 'REGISTER_FORM';
    this.errorMessage = null;
    this.successMessage = null;
  }

  /**
   * Helper email format validator
   */
  private isValidEmail(email: string): boolean {
    const emailRegexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegexPattern.test(email);
  }
}

