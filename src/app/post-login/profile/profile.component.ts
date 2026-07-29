import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SbmBankApiService } from '../../core/services/sbm-bank-api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProfileComponent implements OnInit {

  // Active Tab State: 'credentials' | 'analytics' | 'help'
  activeTab: 'credentials' | 'analytics' | 'help' = 'credentials';

  // Live Production Approval Security State (Defaults to false until Go-Live Compliance Audit is completed)
  isLiveApproved: boolean = false;

  // User Profile Details & Dual Environment Credentials (Sandbox & Live Production)
  userProfile = {
    name: 'Allan Cheruiyot',
    email: 'allan.cheruiyot@sbmbank.co.ke',
    phone: '+254 712 345 678',
    role: 'API Administrator',
    organization: 'SBM Bank Kenya',
    avatar: 'AC',
    tier: 'API Administrator',
    status: 'ACTIVE',
    // Sandbox Environment Credentials (Single Active Key - Always Unlocked)
    sandboxClientId: 'sbm_sbx_client_948172648192',
    sandboxHmacSecret: 'sbm_sbx_sec_84719284719284719283719284719283',
    sandboxBaseUrl: 'https://sandbox.api.sbmbank.co.ke/v1',
    sandboxStatus: 'ACTIVE',
    // Live Production Environment Credentials (Locked until Go-Live Approved)
    liveClientId: 'sbm_live_prod_309284019284',
    liveHmacSecret: 'sbm_live_sec_99381726491827364918273649182736',
    liveBaseUrl: 'https://api.sbmbank.co.ke/v1',
    liveStatus: 'PENDING ONBOARDING',
    quotaUsed: 74250,
    quotaLimit: 100000
  };


  sbmLogoPath: string = 'assets/sbm-logo.png';
  sbmLogoSvgPath: string = 'sbm-logo.svg';

  // Toast Notification
  showToast: boolean = false;
  toastMessage: string = '';

  // Show Key Secret Toggles
  showSandboxHmacSecret: boolean = false;
  showLiveHmacSecret: boolean = false;

  // Profile Dropdown State
  isProfileDropdownOpen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sbmApiService: SbmBankApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Read query params for tab switching (e.g. /post_login/profile?tab=settings)
    this.route.queryParams.subscribe(params => {
      if (params['tab'] && ['credentials', 'analytics', 'help'].includes(params['tab'])) {
        this.activeTab = params['tab'];
      }
    });

    // Populate user info from AuthService session if logged in
    const user = this.authService.getUser();
    if (user && (user.firstName || user.lastName)) {
      const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      if (name) {
        this.userProfile.name = name;
        this.userProfile.avatar = name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
      }
      if (user.email) {
        this.userProfile.email = user.email;
      }
      if (user.phone) {
        this.userProfile.phone = user.phone;
      }
      if (user.organizationName) {
        this.userProfile.organization = user.organizationName;
      }
    }
  }

  setTab(tab: 'credentials' | 'analytics' | 'help'): void {
    this.activeTab = tab;
  }

  toggleSandboxSecretVisibility(): void {
    this.showSandboxHmacSecret = !this.showSandboxHmacSecret;
  }

  toggleLiveSecretVisibility(): void {
    if (!this.isLiveApproved) {
      this.triggerToast('Complete Go-Live Wizard onboarding and KYB compliance audit to unlock Live Production credentials.');
      return;
    }
    this.showLiveHmacSecret = !this.showLiveHmacSecret;
  }

  copyToClipboard(text: string, label: string): void {
    if (label.includes('Production') && !this.isLiveApproved) {
      this.triggerToast('Complete Go-Live Wizard onboarding and KYB compliance audit to unlock Live Production credentials.');
      return;
    }
    navigator.clipboard.writeText(text);
    this.triggerToast(`${label} copied to clipboard!`);
  }


  // Regenerate Live Production Key (Overrides existing Live key for security)
  regenerateLiveKey(): void {
    if (!this.isLiveApproved) {
      this.triggerToast('Complete Go-Live Wizard onboarding and KYB compliance audit to unlock Live Production credentials.');
      return;
    }
    const newRand = Math.floor(100000000000 + Math.random() * 900000000000);
    const newSecret = 'sbm_live_sec_' + Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
    this.userProfile.liveClientId = `sbm_live_prod_${newRand}`;
    this.userProfile.liveHmacSecret = newSecret;
    this.triggerToast('Production API Key regenerated & overridden successfully!');
  }

  launchSandboxPlayground(): void {
    this.router.navigate(['/post_login/sandbox']);
  }

  launchGoLiveConsole(): void {
    this.router.navigate(['/post_login/go-live']);
  }



  navigateBackToDashboard(): void {
    this.router.navigate(['/post_login/dashboard']);
  }

  triggerToast(msg: string): void {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3500);
  }

  onLogoError(event: any): void {
    event.target.src = this.sbmLogoSvgPath;
  }

  signOut(): void {
    this.authService.logout();
    this.router.navigate(['/pre-login/login']);
  }

  // Profile Dropdown Methods
  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  openProfileDropdown(): void {
    this.isProfileDropdownOpen = true;
  }

  closeProfileDropdown(): void {
    this.isProfileDropdownOpen = false;
  }

  onDropdownItemClick(itemName: string): void {
    this.isProfileDropdownOpen = false;
    if (itemName.includes('Credentials')) {
      this.setTab('credentials');
      return;
    }
    if (itemName.includes('Analytics')) {
      this.setTab('analytics');
      return;
    }
    if (itemName.includes('Help')) {
      this.setTab('help');
      return;
    }
    if (itemName.includes('Sandbox')) {
      this.router.navigate(['/post_login/sandbox']);
      return;
    }
    if (itemName.includes('Go-Live') || itemName.includes('Production')) {
      this.router.navigate(['/post_login/go-live']);
      return;
    }
  }
}
