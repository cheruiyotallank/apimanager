import { Component, NgZone, ChangeDetectorRef, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpAdapterService } from '../../core/services/http-adapter.service';
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
  public isRegistrationComplete: boolean = false;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;

  /**
   * REQUEST OBJECT FOR BACKEND API CALLS
   */
  public request: any = {};

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(
    private router: Router,
    private httpAdapter: HttpAdapterService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.request = { ...this.httpAdapter.preLoginRequest };
  }

  /**
   * Fallback for logo error.
   */
  public onLogoError(): void {
    this.sbmLogoPath = null;
  }

  /**
   * Form submission handler for account registration via HttpAdapterService.
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

    // Set request data for backend API call
    this.request.firstName = this.registerData.firstName;
    this.request.lastName = this.registerData.lastName;
    this.request.email = this.registerData.email;
    this.request.organizationName = this.registerData.organizationName;
    this.request.organizationType = this.registerData.organizationType;
    this.request.country = this.registerData.country;
    this.request.phone = this.registerData.phone;
    this.request.acceptTerms = this.registerData.acceptTerms;
    this.request.ReqService = 'APIM_SIGNUP';

    this.httpAdapter.sendRequest(this.request).subscribe({
      next: (data: any) => {
        console.log('Registration response:', data);
        this.ngZone.run(() => {
          this.isSubmitting = false;
          try {
            let jsonResponse = JSON.parse(data);
            console.log('Parsed JSON:', jsonResponse);
            if ('ErrorMessage' in jsonResponse) {
              this.errorMessage = jsonResponse['ErrorMessage'];
              console.log('Error message set:', this.errorMessage);
            } else {
              this.step = 'EMAIL_VERIFICATION';
              this.successMessage = jsonResponse['ResultMessage'] || `Verification code sent to ${this.registerData.email}. Enter code below.`;
              console.log('Success message set:', this.successMessage);
            }
          } catch (e) {
            console.error('JSON parse error:', e);
            this.errorMessage = 'Service error. Please try again later.';
          }
          this.cdr.detectChanges();
        });
      },
      error: (error: any) => {
        console.error('HTTP error:', error);
        this.ngZone.run(() => {
          this.isSubmitting = false;
          this.errorMessage = 'Unable to connect to server. Please check your internet connection.';
          console.log('Error message set:', this.errorMessage);
          this.cdr.detectChanges();
        });
      }
    });
  }

  /**
   * Verifies 6-digit Email OTP Verification Code via HttpAdapterService & completes registration.
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

    // Set request data for backend API call
    this.request.email = this.registerData.email;
    this.request.verificationCode = fullCode;
    this.request.ReqService = 'APIM_VERIFY_SIGNUP_OTP';

    this.httpAdapter.sendRequest(this.request).subscribe({
      next: (data: any) => {
        this.ngZone.run(() => {
          this.isSubmitting = false;
          try {
            let jsonResponse = JSON.parse(data);
            if ('ErrorMessage' in jsonResponse) {
              this.errorMessage = jsonResponse['ErrorMessage'];
            } else {
              // Store success message in service and redirect to login
              const successMsg = jsonResponse['ResultMessage'] || 'Registration complete! Your temporary password has been sent to your email address. You can now log in.';
              this.authService.setSuccessMessage(successMsg);
              this.router.navigate(['/']);
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
   * Navigates directly to the Login page
   */
  public navigateToLogin(): void {
    this.router.navigate(['/pre-login/login'], { state: { email: this.registerData.email } });
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
   * Resends Email Verification OTP code via HttpAdapterService.
   */
  public resendEmailOtp(): void {
    this.errorMessage = null;
    this.successMessage = null;

    // Set request data for backend API call
    this.request.email = this.registerData.email;
    this.request.ReqService = 'API_MANAGER_RESEND_OTP';

    this.httpAdapter.sendRequest(this.request).subscribe({
      next: (data: any) => {
        try {
          let jsonResponse = JSON.parse(data);
          if ('ErrorMessage' in jsonResponse) {
            this.errorMessage = jsonResponse['ErrorMessage'];
          } else {
            this.successMessage = jsonResponse['ResultMessage'] || `A new 6-digit verification code has been sent to ${this.registerData.email}.`;
          }
        } catch (e) {
          this.successMessage = `A new 6-digit verification code has been sent to ${this.registerData.email}.`;
        }
      },
      error: (error: any) => {
        this.successMessage = `A new 6-digit verification code has been sent to ${this.registerData.email}.`;
      }
    });
  }

  /**
   * Navigates back to registration form step.
   */
  public backToRegisterForm(): void {
    this.step = 'REGISTER_FORM';
    this.isRegistrationComplete = false;
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

  onCkickLogin() {
    this.router.navigate(['/']);
  }
}

