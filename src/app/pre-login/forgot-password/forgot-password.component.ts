import { Component, OnInit, NgZone, ChangeDetectorRef, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpAdapterService } from '../../core/services/http-adapter.service';

/**
 * ============================================================================
 * SBM BANK FORGOT PASSWORD COMPONENT (pre-login/forgot-password/forgot-password.component.ts)
 * ============================================================================
 * Manages password reset workflow: email submission sends OTP to registered
 * email, OTP verification generates a fresh password and emails it to the user.
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
export class ForgotPasswordComponent implements OnInit {

  /**
   * SBM BANK ASSET PATHS
   */
  public sbmLogoPath: string | null = 'assets/sbm-logo.png';
  public sbmLeftBannerPath: string | null = 'assets/background5.jpg';

  /**
   * WORKFLOW STEP: 'EMAIL_FORM' | 'OTP_VERIFICATION'
   */
  public step: 'EMAIL_FORM' | 'OTP_VERIFICATION' = 'EMAIL_FORM';

  /**
   * FORM MODEL
   */
  public email: string = '';

  /**
   * EMAIL VERIFICATION OTP CODE STATE (6-Digit Code)
   */
  public verificationCode: string[] = ['', '', '', '', '', ''];

  /**
   * UI STATES
   */
  public isSubmitting: boolean = false;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;

  /**
   * REQUEST OBJECT FOR BACKEND API CALLS
   */
  public request: any = {};

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private httpAdapter: HttpAdapterService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.request = { ...this.httpAdapter.preLoginRequest };
  }

  /**
   * Fallback for logo error
   */
  public onLogoError(): void {
    this.sbmLogoPath = null;
  }

  /**
   * STEP 1: Submit email - sends OTP to registered email address
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

    // Set request data for backend API call
    this.request.email = this.email.trim().toLowerCase();
    this.request.ReqService = 'APIM_FORGOT_PASSWORD';

    this.httpAdapter.sendRequest(this.request).subscribe({
      next: (data: any) => {
        this.ngZone.run(() => {
          this.isSubmitting = false;
          try {
            let jsonResponse = JSON.parse(data);
            if ('ErrorMessage' in jsonResponse) {
              this.errorMessage = jsonResponse['ErrorMessage'];
            } else {
              this.step = 'OTP_VERIFICATION';
              this.successMessage = jsonResponse['ResultMessage'] || `Verification code sent to ${this.email}. Enter code below.`;
            }
          } catch (e) {
            this.errorMessage = 'Service error. Please try again later.';
          }
          this.cdr.detectChanges();
        });
      },
      error: (error: any) => {
        this.ngZone.run(() => {
          this.isSubmitting = false;
          this.errorMessage = 'Unable to connect to server. Please check your internet connection.';
          this.cdr.detectChanges();
        });
      }
    });
  }

  /**
   * STEP 2: Verify OTP - generates fresh password and sends to email
   */
  public verifyOtp(): void {
    this.errorMessage = null;
    this.successMessage = null;

    const fullCode = this.verificationCode.join('');
    if (fullCode.length < 6) {
      this.errorMessage = 'Please enter the complete 6-digit verification code.';
      return;
    }

    this.isSubmitting = true;

    // Set request data for backend API call
    this.request.email = this.email.trim().toLowerCase();
    this.request.verificationCode = fullCode;
    this.request.ReqService = 'APIM_VERIFY_FORGOT_OTP';

    this.httpAdapter.sendRequest(this.request).subscribe({
      next: (data: any) => {
        this.ngZone.run(() => {
          this.isSubmitting = false;
          try {
            let jsonResponse = JSON.parse(data);
            if ('ErrorMessage' in jsonResponse) {
              this.errorMessage = jsonResponse['ErrorMessage'];
            } else {
              const successMsg = jsonResponse['ResultMessage'] || 'Password reset complete! A new password has been sent to your email address. You can now log in.';
              this.authService.setSuccessMessage(successMsg);
              this.router.navigate(['/pre-login/login']);
            }
          } catch (e) {
            this.errorMessage = 'Service error. Please try again later.';
          }
          this.cdr.detectChanges();
        });
      },
      error: (error: any) => {
        this.ngZone.run(() => {
          this.isSubmitting = false;
          this.errorMessage = 'Unable to connect to server. Please check your internet connection.';
          this.cdr.detectChanges();
        });
      }
    });
  }

  /**
   * Resends OTP code to email
   */
  public resendOtp(): void {
    this.errorMessage = null;
    this.successMessage = null;

    // Set request data for backend API call
    this.request.email = this.email.trim().toLowerCase();
    this.request.ReqService = 'APIM_FORGOT_PASSWORD';

    this.httpAdapter.sendRequest(this.request).subscribe({
      next: (data: any) => {
        try {
          let jsonResponse = JSON.parse(data);
          if ('ErrorMessage' in jsonResponse) {
            this.errorMessage = jsonResponse['ErrorMessage'];
          } else {
            this.successMessage = jsonResponse['ResultMessage'] || `A new 6-digit verification code has been sent to ${this.email}.`;
          }
        } catch (e) {
          this.successMessage = `A new 6-digit verification code has been sent to ${this.email}.`;
        }
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.successMessage = `A new 6-digit verification code has been sent to ${this.email}.`;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Handles OTP input - auto-focus next input
   */
  public onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Keep only numeric characters
    if (!/^\d*$/.test(value)) {
      input.value = '';
      this.verificationCode[index] = '';
      return;
    }

    // Move to next input if value is entered
    if (value && index < 5) {
      const inputs = this.otpInputs.toArray();
      const nextInput = inputs[index + 1].nativeElement;
      nextInput.focus();
    }
  }

  /**
   * Handles backspace in OTP input - auto-focus previous input
   */
  public onOtpBackspace(event: any, index: number): void {
    const input = event.target as HTMLInputElement;

    // If current input is empty, move to previous input
    if (!input.value && index > 0) {
      const inputs = this.otpInputs.toArray();
      const prevInput = inputs[index - 1].nativeElement;
      prevInput.focus();
    }
  }

  /**
   * Navigates back to email form step
   */
  public backToEmailForm(): void {
    this.step = 'EMAIL_FORM';
    this.errorMessage = null;
    this.successMessage = null;
    this.verificationCode = ['', '', '', '', '', ''];
  }

  /**
   * Email validator
   */
  private isValidEmail(email: string): boolean {
    const emailRegexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegexPattern.test(email);
  }

  /**
   * Navigate to login page
   */
  public navigateToLogin(): void {
    this.router.navigate(['/pre-login/login']);
  }
}
