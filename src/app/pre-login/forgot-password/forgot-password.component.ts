import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

/**
 * ============================================================================
 * SBM BANK FORGOT PASSWORD COMPONENT (pre-login/forgot-password/forgot-password.component.ts)
 * ============================================================================
 * Manages password reset requests, email validation, and user feedback.
 * ============================================================================
 */
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  /**
   * SBM BANK ASSET PATHS
   */
  public sbmLogoPath: string | null = 'assets/sbm-logo.png';
  public sbmLeftBannerPath: string | null = 'assets/background5.jpg';

  /**
   * FORM MODEL
   */
  public email: string = '';

  /**
   * UI STATES
   */
  public isSubmitting: boolean = false;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  /**
   * Fallback for logo error
   */
  public onLogoError(): void {
    this.sbmLogoPath = null;
  }

  /**
   * Submit handler for password reset link
   */
  public onResetSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (!this.email || !this.email.trim()) {
      this.errorMessage = 'Please enter your Email Address.';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid Email Address (e.g. user@sbm.co.ke).';
      return;
    }

    this.isSubmitting = true;

    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = 'Password reset link sent! Check your email inbox for instructions.';
      
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2500);
    }, 1500);
  }

  /**
   * Email validator
   */
  private isValidEmail(email: string): boolean {
    const emailRegexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegexPattern.test(email);
  }
}
