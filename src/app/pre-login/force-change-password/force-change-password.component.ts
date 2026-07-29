import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpAdapterService } from '../../core/services/http-adapter.service';

/**
 * ============================================================================
 * SBM BANK FORCE CHANGE PASSWORD COMPONENT (pre-login/force-change-password/force-change-password.component.ts)
 * ============================================================================
 * Handles first-time login password change requirement. First-time users who log in
 * with their emailed temporary password are directed to this component to set their
 * secure permanent password before account activation.
 * ============================================================================
 */
@Component({
  selector: 'app-force-change-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './force-change-password.component.html',
  styleUrl: './force-change-password.component.css'
})
export class ForceChangePasswordComponent implements OnInit {

  /**
   * SBM BANK ASSET PATHS
   */
  public sbmLogoPath: string | null = 'assets/sbm-logo.png';
  public sbmLeftBannerPath: string | null = 'assets/background5.jpg';

  /**
   * FORCE CHANGE PASSWORD FORM MODEL
   */
  public passwordData = {
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  /**
   * VISIBILITY TOGGLE FLAGS
   */
  public isOldPasswordVisible: boolean = false;
  public isNewPasswordVisible: boolean = false;
  public isConfirmPasswordVisible: boolean = false;

  /**
   * UI INTERACTIVE STATES
   */
  public isSubmitting: boolean = false;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;

  /**
   * REQUEST OBJECT FOR BACKEND API CALLS
   */
  public request: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private httpAdapter: HttpAdapterService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    // Initialize request object
    this.request = { ...this.httpAdapter.preLoginRequest };

    // Read email passed from login state or query params if available
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state && nav.extras.state['email']) {
      this.passwordData.email = nav.extras.state['email'];
    }

    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.passwordData.email = params['email'];
      }
    });
  }

  /**
   * Logo image load fallback
   */
  public onLogoError(): void {
    this.sbmLogoPath = null;
  }

  /**
   * Toggle visibility of Old Password field
   */
  public toggleOldPasswordVisibility(): void {
    this.isOldPasswordVisible = !this.isOldPasswordVisible;
  }

  /**
   * Toggle visibility of New Password field
   */
  public toggleNewPasswordVisibility(): void {
    this.isNewPasswordVisible = !this.isNewPasswordVisible;
  }

  /**
   * Toggle visibility of Confirm Password field
   */
  public toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  /**
   * Submits Force Change Password (Old, New, Confirm Passwords) via HttpAdapterService
   */
  public onForceChangePasswordSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (!this.passwordData.email) {
      this.errorMessage = 'Email address is missing. Please enter your email address.';
      return;
    }

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
      this.errorMessage = 'New Password must be different from your Temporary Password.';
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

    // Set request data for backend API call
    this.request.email = this.passwordData.email;
    this.request.oldPassword = this.passwordData.oldPassword;
    this.request.newPassword = this.passwordData.newPassword;
    this.request.confirmPassword = this.passwordData.confirmPassword;
    this.request.ReqService = 'APIM_FORCE_CHANGE_PASSWORD';

    this.httpAdapter.sendRequest(this.request).subscribe({
      next: (data: any) => {
        this.ngZone.run(() => {
          this.isSubmitting = false;
          try {
            let jsonResponse = JSON.parse(data);
            if ('ErrorMessage' in jsonResponse) {
              this.errorMessage = jsonResponse['ErrorMessage'];
            } else {
              this.successMessage = 'Password changed successfully! Account activated. Directing to Login...';
              this.authService.setSuccessMessage('Password changed successfully! You can now login with your new password.');
              setTimeout(() => {
                this.router.navigate(['/pre-login/login']);
              }, 1500);
            }
          } catch (e) {
            this.errorMessage = 'Service error. Please try again later.';
          }
        });
      },
      error: (error: any) => {
        this.ngZone.run(() => {
          this.isSubmitting = false;
          this.errorMessage = error?.message || 'Password update failed. Please check your credentials and try again.';
        });
      }
    });
  }

  /**
   * Navigates back to Login screen
   */
  public navigateToLogin(): void {
    this.router.navigate(['/pre-login/login']);
  }
}
