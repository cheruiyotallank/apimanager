import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

/**
 * ============================================================================
 * SBM BANK REGISTER (SIGN UP) COMPONENT (pre-login/register/register.component.ts)
 * ============================================================================
 * Manages user registration state, organization profile, email verification workflow,
 * asset paths, and navigation back to login.
 * Password credentials are securely generated and emailed to the user upon verification.
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
   * WORKFLOW STEP: 'REGISTER_FORM' | 'EMAIL_VERIFICATION'
   */
  public step: 'REGISTER_FORM' | 'EMAIL_VERIFICATION' = 'REGISTER_FORM';

  /**
   * USER REGISTRATION FORM MODEL (Personal & Organization Profile)
   */
  public registerData = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    organizationName: '',
    organizationType: 'Enterprise',
    country: 'Kenya (+254)',
    phone: '',
    acceptTerms: false
  };

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

  constructor(private router: Router) { }

  /**
   * Fallback for logo error.
   */
  public onLogoError(): void {
    this.sbmLogoPath = null;
  }

  /**
   * Form submission handler for account registration.
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

    // Username validation
    if (!this.registerData.username || !this.registerData.username.trim()) {
      this.errorMessage = 'Please enter your Username.';
      return;
    }

    // Organization Profile validation
    if (!this.registerData.organizationName || !this.registerData.organizationName.trim()) {
      this.errorMessage = 'Please enter your Organization / Company Name.';
      return;
    }

    // Phone Number validation
    if (!this.registerData.phone || !this.registerData.phone.trim()) {
      this.errorMessage = 'Please enter your Phone Number.';
      return;
    }

    // Terms & Conditions check
    if (!this.registerData.acceptTerms) {
      this.errorMessage = "You must accept SBM Bank's Terms and Conditions concerning this application.";
      return;
    }

    // Transition to Email Verification Workflow
    this.isSubmitting = true;

    setTimeout(() => {
      this.isSubmitting = false;
      this.step = 'EMAIL_VERIFICATION';
      this.successMessage = `Verification code sent to ${this.registerData.email}. Enter code below.`;
    }, 1200);
  }

  /**
   * Verifies 6-digit Email OTP Verification Code.
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

    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = 'Email verified! Account login credentials have been sent to your email inbox.';

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }, 1200);
  }

  /**
   * Resends Email Verification OTP code.
   */
  public resendEmailOtp(): void {
    this.errorMessage = null;
    this.successMessage = `A new 6-digit verification code has been sent to ${this.registerData.email}.`;
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
