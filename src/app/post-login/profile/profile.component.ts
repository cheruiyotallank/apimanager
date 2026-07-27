import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SbmBankApiService } from '../../core/services/sbm-bank-api.service';
import { AuthService } from '../../core/services/auth.service';

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  createdDate: string;
  environment: 'SANDBOX' | 'PRODUCTION';
  status: 'ACTIVE' | 'REVOKED';
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: false
})
export class ProfileComponent implements OnInit {

  // Active Tab State: 'credentials' | 'apikeys' | 'analytics' | 'settings' | 'help'
  activeTab: 'credentials' | 'apikeys' | 'analytics' | 'settings' | 'help' = 'credentials';

  // User Profile Credentials
  userProfile = {
    name: 'Allan Cheruiyot',
    email: 'allan.cheruiyot@sbmbank.co.ke',
    role: 'API Administrator',
    organization: 'SBM Bank Kenya',
    avatar: 'AC',
    tier: 'Enterprise Admin',
    clientId: 'sbm_client_948172648192',
    hmacSecret: 'sbm_sec_hmac_84719284719284719283719284719283',
    quotaUsed: 74250,
    quotaLimit: 100000
  };

  sbmLogoPath: string = 'assets/sbm-logo.png';
  sbmLogoSvgPath: string = 'sbm-logo.svg';

  // Toast Notification
  showToast: boolean = false;
  toastMessage: string = '';

  // API Keys List
  apiKeys: ApiKeyItem[] = [
    { id: 'key_1', name: 'Safaricom M-Pesa Primary Key', keyPrefix: 'sbm_live_9481...a82f', createdDate: '2026-01-15', environment: 'SANDBOX', status: 'ACTIVE' },
    { id: 'key_2', name: 'PesaLink IPSL Secondary Key', keyPrefix: 'sbm_live_7361...b91c', createdDate: '2026-03-02', environment: 'SANDBOX', status: 'ACTIVE' },
    { id: 'key_3', name: 'Utility Settlements Key', keyPrefix: 'sbm_live_2841...c49d', createdDate: '2026-05-10', environment: 'SANDBOX', status: 'ACTIVE' }
  ];

  // Show Key Secret Toggle
  showHmacSecret: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sbmApiService: SbmBankApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Read query params for tab switching (e.g. /post_login/profile?tab=apikeys)
    this.route.queryParams.subscribe(params => {
      if (params['tab'] && ['credentials', 'apikeys', 'analytics', 'settings', 'help'].includes(params['tab'])) {
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
    }
  }

  setTab(tab: 'credentials' | 'apikeys' | 'analytics' | 'settings' | 'help'): void {
    this.activeTab = tab;
  }

  toggleSecretVisibility(): void {
    this.showHmacSecret = !this.showHmacSecret;
  }

  copyToClipboard(text: string, label: string): void {
    navigator.clipboard.writeText(text);
    this.triggerToast(`${label} copied to clipboard!`);
  }

  generateNewKey(keyName: string): void {
    this.sbmApiService.generateApiKey(keyName).subscribe({
      next: (res) => {
        this.triggerToast('New API key created successfully!');
      },
      error: () => {
        const newId = 'key_' + (this.apiKeys.length + 1);
        const randPrefix = 'sbm_live_' + Math.floor(1000 + Math.random() * 9000) + '...a' + Math.floor(10 + Math.random() * 89);
        this.apiKeys.push({
          id: newId,
          name: keyName || 'New API Key',
          keyPrefix: randPrefix,
          createdDate: new Date().toISOString().split('T')[0],
          environment: 'SANDBOX',
          status: 'ACTIVE'
        });
        this.triggerToast(`Generated New API Key: ${keyName}`);
      }
    });
  }

  revokeKey(keyId: string): void {
    this.sbmApiService.revokeApiKey(keyId).subscribe({
      next: () => {
        this.apiKeys = this.apiKeys.filter(k => k.id !== keyId);
        this.triggerToast('API Key revoked');
      },
      error: () => {
        this.apiKeys = this.apiKeys.filter(k => k.id !== keyId);
        this.triggerToast('API Key revoked');
      }
    });
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
}
