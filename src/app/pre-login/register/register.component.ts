import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

/**
 * ============================================================================
 * SBM BANK REGISTER (SIGN UP) COMPONENT (pre-login/register/register.component.ts)
 * ============================================================================
 * Manages user registration state, input validation, SBM Bank asset paths,
 * and navigation back to login.
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
   * USER REGISTRATION FORM MODEL
   */
  public registerData = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    country: 'Kenya (+254)',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  };

  /**
   * COUNTRY OPTIONS
   */
  public countries: string[] = [
    'Kenya (+254)',
    'Mauritius (+230)',
    'India (+91)',
    'United Kingdom (+44)',
    'United States (+1)',
    'Other International'
  ];

  /**
   * UI INTERACTIVE STATES
   */
  public isPasswordVisible: boolean = false;
  public isConfirmPasswordVisible: boolean = false;
  public isSubmitting: boolean = false;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;

  constructor(private router: Router) { }

  /**
   * Toggles password field visibility.
   */
  public togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  /**
   * Toggles confirm password field visibility.
   */
  public toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

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

    // Phone Number validation
    if (!this.registerData.phone || !this.registerData.phone.trim()) {
      this.errorMessage = 'Please enter your Phone Number.';
      return;
    }

    // Password validation
    if (!this.registerData.password) {
      this.errorMessage = 'Please enter a Password.';
      return;
    }

    if (this.registerData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }

    // Confirm Password matching check
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'Passwords do not match. Please check and try again.';
      return;
    }

    // Terms & Conditions check
    if (!this.registerData.acceptTerms) {
      this.errorMessage = "You must accept SBM Bank's Terms and Conditions concerning this application.";
      return;
    }

    // Process Registration
    this.isSubmitting = true;

    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = 'Account created successfully! Redirecting to login...';

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1200);
    }, 1500);
  }

  /**
   * Helper email format validator
   */
  private isValidEmail(email: string): boolean {
    const emailRegexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegexPattern.test(email);
  }

  /**
   * Evaluates real-time password strength score and label.
   */
  public getPasswordStrength(): { label: string; colorClass: string; textClass: string; percent: number } {
    const pwd = this.registerData.password || '';
    if (!pwd) {
      return { label: '', colorClass: '', textClass: '', percent: 0 };
    }

    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;

    if (score <= 2) {
      return { label: 'Weak', colorClass: 'bg-danger', textClass: 'text-danger', percent: 33 };
    } else if (score <= 4) {
      return { label: 'Medium', colorClass: 'bg-warning', textClass: 'text-warning', percent: 66 };
    } else {
      return { label: 'Strong', colorClass: 'bg-success', textClass: 'text-success', percent: 100 };
    }
  }
}
