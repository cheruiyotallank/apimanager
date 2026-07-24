import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

/**
 * ============================================================================
 * SBM BANK LOGIN COMPONENT (pre-login/login/login.component.ts)
 * ============================================================================
 * Manages authentication input state, SBM Bank logo asset paths,
 * validation feedback, and form submissions.
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
   * - `sbmLogoPath`: Path to SBM Bank company logo image file.
   * - `sbmLeftBannerPath`: Path to left-side custom background image if uploaded.
   */
  public sbmLogoPath: string | null = 'assets/sbm-logo.png';
  //public sbmLeftBannerPath: string | null = 'assets/background4.png';
  public sbmLeftBannerPath: string | null = 'assets/background5.jpg';


  /**
   * USER CREDENTIALS MODEL
   */
  public userCredentials = {
    email: '',
    password: '',
    rememberMe: false
  };

  /**
   * UI INTERACTIVE STATES
   */
  public isPasswordVisible: boolean = false;
  public isSubmitting: boolean = false;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;

  constructor(private router: Router) { }

  /**
   * Toggles the visibility of the password text field.
   */
  public togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  /**
   * Fallback handler if the logo image asset is not yet present in assets folder.
   */
  public onLogoError(): void {
    this.sbmLogoPath = null; // Fallback to vector icon badge
  }

  /**
   * Form submission handler for SBM Bank login authentication.
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
      this.errorMessage = 'Please enter a valid Email ID (e.g. user@sbm.com).';
      return;
    }

    // Password validation
    if (!this.userCredentials.password) {
      this.errorMessage = 'Please enter your Password.';
      return;
    }

    // Start Authentication
    this.isSubmitting = true;

    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = 'Authentication successful! Directing to SBM Portal...';

      setTimeout(() => {
        this.router.navigate(['/signup']);
      }, 1000);
    }, 1500);
  }

  /**
   * Helper email validator
   */
  private isValidEmail(email: string): boolean {
    const emailRegexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegexPattern.test(email);
  }
}
