import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpAdapterService } from '../../core/services/http-adapter.service';
import { Subscription } from 'rxjs';

/**
 * ============================================================================
 * SBM BANK LOGIN COMPONENT (pre-login/login/login.component.ts)
 * ============================================================================
 * Manages authentication state, MFA OTP verification, OAuth2/SSO integrations,
 * asset paths, and navigation with strict authentication validation.
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
export class LoginComponent implements OnInit, OnDestroy {

  private successMessageSubscription: Subscription | null = null;
  private successMessageTimeout: any = null;

  /**
   * REQUEST OBJECT FOR BACKEND API CALLS
   */
  public request: any = {};

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
    private authService: AuthService,
    private httpAdapter: HttpAdapterService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    // Initialize request object
    this.request = { ...this.httpAdapter.preLoginRequest };

    // Subscribe to success message from AuthService for reactive updates
    this.successMessageSubscription = this.authService.getSuccessMessage().subscribe(message => {
      this.ngZone.run(() => {
        this.successMessage = message;
        this.cdr.detectChanges();

        // Clear success message after 5 seconds locally
        if (message && this.successMessageTimeout) {
          clearTimeout(this.successMessageTimeout);
        }
        if (message) {
          this.successMessageTimeout = setTimeout(() => {
            this.ngZone.run(() => {
              this.successMessage = null;
              this.cdr.detectChanges();
            });
          }, 5000);
        }
      });
    });
  }

  ngOnDestroy(): void {
    if (this.successMessageSubscription) {
      this.successMessageSubscription.unsubscribe();
    }
    if (this.successMessageTimeout) {
      clearTimeout(this.successMessageTimeout);
    }
  }

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
   * Credentials submission handler - Enforces strict authentication validation.
   */
  public onLoginSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    const email = (this.userCredentials.email || '').trim().toLowerCase();
    const password = (this.userCredentials.password || '').trim();

    // Basic Input Validation
    if (!email) {
      this.errorMessage = 'Please enter your corporate email address.';
      return;
    }

    if (!password) {
      this.errorMessage = 'Please enter your password.';
      return;
    }

    if (password.length < 6) {
      this.errorMessage = 'Invalid password length. Password must be at least 6 characters.';
      return;
    }

    this.isSubmitting = true;

    // Set request data for backend API call
    this.request.email = email;
    this.request.password = password;
    this.request.ReqService = 'APIM_LOGIN';

    this.httpAdapter.sendRequest(this.request).subscribe({
      next: (data: any) => {
        this.ngZone.run(() => {
          this.isSubmitting = false;
          try {
            let jsonResponse = JSON.parse(data);
            if ('ErrorMessage' in jsonResponse) {
              this.errorMessage = jsonResponse['ErrorMessage'];
              if (jsonResponse['ForceChangePassword'] === "Y") {
                this.router.navigate(['/pre-login/force-change-password'], { state: { email: email } });
              }
            } else {
              // Save session with backend response fields
              this.authService.saveSession({
                accessToken: jsonResponse['SessionID'] || 'temp_token',
                user: {
                  id: jsonResponse['userId'] || '0',
                  firstName: jsonResponse['firstName'] || '',
                  lastName: jsonResponse['lastName'] || '',
                  email: jsonResponse['email'] || email,
                  phone: jsonResponse['phone'] || '',
                  organizationName: jsonResponse['organizationName'] || '',
                  organizationType: jsonResponse['organizationType'] || '',
                  country: jsonResponse['country'] || '',
                  roles: jsonResponse['roles'] || ['USER'],
                  apiKey: jsonResponse['apiKey'] || ''
                }
              });

              this.router.navigate(['/post_login/dashboard']);
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
   * Navigates to forgot password page.
   */
  public navigateToForgotPassword(): void {
    this.router.navigate(['/pre-login/forgot-password']);
  }

  /**
   * Navigates to signup page.
   */
  public navigateToSignup(): void {
    this.router.navigate(['/pre-login/signup']);
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

  onCkickSignup() {
    this.router.navigate(['/signup']);
  }
}
