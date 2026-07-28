import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SbmBankApiService } from '../../core/services/sbm-bank-api.service';
import { AuthService } from '../../core/services/auth.service';

export interface ApiCategory {
  id: string;
  name: string;
  badge: string;
  icon: string;
  accentColor: string;
  bgGradient: string;
  description: string;
  redirectUrl: string;
  status: 'Operational' | 'Coming Soon';
  endpointsCount: number;
  endpoints: { method: 'GET' | 'POST' | 'PUT' | 'DELETE'; path: string; name: string; description?: string }[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class DashboardComponent implements OnInit {
  // Search & Filter State
  searchQuery: string = '';

  // User Profile Info - Allan Cheruiyot
  userProfile = {
    name: 'Allan Cheruiyot',
    email: 'allan.cheruiyot@sbmbank.co.ke',
    role: 'API Administrator',
    organization: 'SBM Bank Kenya',
    avatar: 'AC',
    tier: 'Enterprise Admin',
    activeKeys: 12,
    quotaUsedPercent: 74
  };

  // Profile Dropdown Toggle State
  isProfileDropdownOpen: boolean = false;

  // SBM Bank Logo Path
  sbmLogoPath: string = 'assets/sbm-logo.png';
  sbmLogoSvgPath: string = 'sbm-logo.svg';

  // Selected Category for Details Modal (Safaricom only for active modal view)
  selectedCategoryModal: ApiCategory | null = null;
  activeModalTab: 'endpoints' | 'auth' | 'snippets' = 'endpoints';
  activeSnippetLang: 'curl' | 'ts' | 'python' = 'curl';

  // Interactive Endpoint Testing State inside Modal
  testedEndpointResult: { path: string; name: string; status: number; duration: number; responseJson: string } | null = null;
  isTestingEndpoint: boolean = false;

  showNotificationToast: boolean = false;
  notificationMessage: string = '';

  constructor(
    private router: Router,
    private sbmApiService: SbmBankApiService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log('DashboardComponent ngOnInit called');
    // If logged in via backend auth session, load user details
    const savedUser = this.authService.getUser();
    if (savedUser && (savedUser.firstName || savedUser.lastName)) {
      const name = `${savedUser.firstName || ''} ${savedUser.lastName || ''}`.trim();
      if (name) {
        this.userProfile.name = name;
        this.userProfile.avatar = name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
      }
      if (savedUser.email) {
        this.userProfile.email = savedUser.email;
      }
    }
  }

  // SBM Bank Kenya API Categories
  apiCategories: ApiCategory[] = [
    {
      id: 'safaricom',
      name: 'Safaricom APIs',
      badge: 'M-PESA Integration',
      icon: 'bi-phone-vibrate-fill',
      accentColor: '#1aa3d8',
      bgGradient: 'linear-gradient(135deg, rgba(26, 163, 216, 0.12) 0%, rgba(6, 33, 77, 0.05) 100%)',
      description: 'Direct M-Pesa mobile money suite supporting STK Push checkout, real-time B2C disbursals, C2B collections & account status requeries.',
      redirectUrl: '/post_login/safaricom',
      status: 'Operational',
      endpointsCount: 5,
      endpoints: [
        { method: 'POST', path: '/v1/safaricom/stk-push', name: 'STK Push Express Checkout', description: 'Triggers SIM Toolkit prompt on subscriber phone.' },
        { method: 'POST', path: '/v1/safaricom/b2c-disburse', name: 'Business to Customer (B2C)', description: 'Direct salary and vendor payments to M-Pesa.' },
        { method: 'POST', path: '/v1/safaricom/c2b-register', name: 'Customer to Business (C2B)', description: 'Real-time payment notification callback URL.' },
        { method: 'GET', path: '/v1/safaricom/account-balance', name: 'Utility Balance Query', description: 'Requery working account float balance.' },
        { method: 'POST', path: '/v1/safaricom/transaction-status', name: 'Transaction Status Requery', description: 'Verify payment completion status.' }
      ]
    },
    {
      id: 'pesalink',
      name: 'PesaLink APIs',
      badge: 'IPSL Instant Transfer',
      icon: 'bi-lightning-charge-fill',
      accentColor: '#06214d',
      bgGradient: 'linear-gradient(135deg, rgba(6, 33, 77, 0.12) 0%, rgba(26, 163, 216, 0.05) 100%)',
      description: 'Integrated Integrated Payments Service Ltd (IPSL) PesaLink API for 24/7 instant bank-to-bank money transfers via phone or account.',
      redirectUrl: '/post_login/pesalink',
      status: 'Coming Soon',
      endpointsCount: 5,
      endpoints: [
        { method: 'POST', path: '/v1/pesalink/send-to-account', name: 'Send Money to Account', description: 'Instant 24/7 interbank transfer via PesaLink account number.' },
        { method: 'POST', path: '/v1/pesalink/send-to-phone', name: 'Send Money to Phone Number', description: 'Direct transfer to linked mobile number via PesaLink IPSL.' },
        { method: 'GET', path: '/v1/pesalink/account-lookup', name: 'Account Name & Bank Lookup', description: 'Verify beneficiary account name and destination bank before transfer.' },
        { method: 'POST', path: '/v1/pesalink/query-status', name: 'Transaction Status Query', description: 'Query PesaLink clearing status by reference ID.' },
        { method: 'GET', path: '/v1/pesalink/participating-banks', name: 'Participating Banks List', description: 'Retrieve active PesaLink IPSL member banks.' }
      ]
    },
    {
      id: 'utility',
      name: 'Billing & Utility APIs',
      badge: 'Utility Settlements',
      icon: 'bi-receipt-cutoff',
      accentColor: '#1aa3d8',
      bgGradient: 'linear-gradient(135deg, rgba(26, 163, 216, 0.12) 0%, rgba(6, 33, 77, 0.05) 100%)',
      description: 'Automated utility payments for KPLC prepaid electricity tokens, Nairobi Water bill settlements, and multi-carrier airtime top-ups.',
      redirectUrl: '/post_login/utility',
      status: 'Coming Soon',
      endpointsCount: 5,
      endpoints: [
        { method: 'POST', path: '/v1/utility/kplc-tokens', name: 'KPLC Prepaid Tokens', description: 'Instant 20-digit electricity token generation.' },
        { method: 'POST', path: '/v1/utility/water-bill', name: 'Nairobi Water Settlement', description: 'Direct clearing for Nairobi Water & municipal bills.' },
        { method: 'POST', path: '/v1/utility/airtime-topup', name: 'Multi-Carrier Airtime', description: 'Instant airtime for Safaricom, Airtel & Telkom.' },
        { method: 'GET', path: '/v1/utility/paybill-query', name: 'Bill Validation & Requery', description: 'Validate account/meter numbers before processing.' },
        { method: 'POST', path: '/v1/utility/tv-subscription', name: 'DStv & Zuku Payments', description: 'Real-time subscription renewal and package validation.' }
      ]
    },
    {
      id: 'fund-transfer',
      name: 'Fund Transfer APIs',
      badge: 'Core Banking Clearing',
      icon: 'bi-arrow-left-right',
      accentColor: '#06214d',
      bgGradient: 'linear-gradient(135deg, rgba(6, 33, 77, 0.12) 0%, rgba(26, 163, 216, 0.05) 100%)',
      description: 'Core banking interbank clearing suite including RTGS settlements, EFT batch processing, internal SBM transfers, and SWIFT wire.',
      redirectUrl: '/post_login/transfers',
      status: 'Coming Soon',
      endpointsCount: 5,
      endpoints: [
        { method: 'POST', path: '/v1/transfer/rtgs-express', name: 'RTGS Express Settlement', description: 'High-value interbank clearing through Central Bank of Kenya.' },
        { method: 'POST', path: '/v1/transfer/eft-batch', name: 'EFT Batch Transfer', description: 'Bulk overnight Electronic Funds Transfer clearing.' },
        { method: 'POST', path: '/v1/transfer/internal', name: 'SBM Internal Account Transfer', description: 'Zero-fee instant account-to-account transfer.' },
        { method: 'POST', path: '/v1/transfer/swift-wire', name: 'Cross-Border SWIFT Wire', description: 'International wire transfer with SWIFT gpi tracking.' },
        { method: 'GET', path: '/v1/transfer/forex-rates', name: 'Live FX Conversion Rates', description: 'Real-time spot exchange rates for USD, EUR, GBP, KES.' }
      ]
    },
    {
      id: 'kyc-identity',
      name: 'Identity & KYC APIs',
      badge: 'IPRS & Tax Validation',
      icon: 'bi-person-check-fill',
      accentColor: '#1aa3d8',
      bgGradient: 'linear-gradient(135deg, rgba(26, 163, 216, 0.12) 0%, rgba(6, 33, 77, 0.05) 100%)',
      description: 'Official Government IPRS National ID verification, KRA PIN tax compliance validation, and CRB credit score lookups.',
      redirectUrl: '/post_login/kyc',
      status: 'Coming Soon',
      endpointsCount: 4,
      endpoints: [
        { method: 'POST', path: '/v1/kyc/national-id', name: 'National ID (IPRS Lookup)', description: 'Verify ID number against Government IPRS database.' },
        { method: 'POST', path: '/v1/kyc/kra-pin', name: 'KRA PIN Tax Validation', description: 'Validate tax compliance status and registered taxpayer name.' },
        { method: 'POST', path: '/v1/kyc/crb-check', name: 'CRB Credit Score Check', description: 'Query TransUnion and Metropol credit scoring profiles.' },
        { method: 'GET', path: '/v1/kyc/aml-screening', name: 'AML & Sanction Screening', description: 'Real-time PEP & OFAC sanction list check.' }
      ]
    },
    {
      id: 'card-services',
      name: 'Card Services APIs',
      badge: 'SBM Visa & Mastercard',
      icon: 'bi-credit-card-2-front-fill',
      accentColor: '#06214d',
      bgGradient: 'linear-gradient(135deg, rgba(6, 33, 77, 0.12) 0%, rgba(26, 163, 216, 0.05) 100%)',
      description: 'SBM Bank Visa & Mastercard virtual card provisioning, transaction authorization controls, card locking, and 3DS authentication.',
      redirectUrl: '/post_login/cards',
      status: 'Coming Soon',
      endpointsCount: 4,
      endpoints: [
        { method: 'POST', path: '/v1/cards/virtual-issue', name: 'Virtual Card Provisioning', description: 'Instantly issue multi-currency debit cards.' },
        { method: 'POST', path: '/v1/cards/block-unblock', name: 'Card Lock & Freeze Controls', description: 'Emergency card block and transaction limits.' },
        { method: 'GET', path: '/v1/cards/transactions', name: 'Real-time Transaction Feed', description: 'Stream ISO 8583 card authorization logs.' },
        { method: 'POST', path: '/v1/cards/3ds-auth', name: '3D Secure OTP Authentication', description: 'Generate and validate 2FA OTP for card payments.' }
      ]
    }
  ];

  // Filtered list based on search term
  get filteredCategories(): ApiCategory[] {
    if (!this.searchQuery.trim()) {
      return this.apiCategories;
    }
    const q = this.searchQuery.toLowerCase();
    return this.apiCategories.filter(cat =>
      cat.name.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q) ||
      cat.badge.toLowerCase().includes(q) ||
      cat.endpoints.some(e => e.name.toLowerCase().includes(q) || e.path.toLowerCase().includes(q))
    );
  }

  // Toggle Profile Dropdown
  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  openProfileDropdown(): void {
    this.isProfileDropdownOpen = true;
  }

  closeProfileDropdown(): void {
    this.isProfileDropdownOpen = false;
  }

  // Launch Sandbox Playground
  openSandboxPlayground(): void {
    this.isProfileDropdownOpen = false;
    this.router.navigate(['/post_login/sandbox']);
  }

  // Launch Go-Live Wizard & Production Console
  openGoLiveConsole(): void {
    this.isProfileDropdownOpen = false;
    this.router.navigate(['/post_login/go-live']);
  }

  // Profile Dropdown Item Handlers - Navigates to /post_login/profile with appropriate tab
  onDropdownItemClick(itemName: string): void {
    this.isProfileDropdownOpen = false;
    if (itemName.includes('Sandbox')) {
      this.router.navigate(['/post_login/sandbox']);
      return;
    }
    if (itemName.includes('Go-Live') || itemName.includes('Production')) {
      this.router.navigate(['/post_login/go-live']);
      return;
    }
    let targetTab = 'credentials';
    if (itemName.includes('Analytics')) {
      targetTab = 'analytics';
    } else if (itemName.includes('Settings')) {
      targetTab = 'settings';
    } else if (itemName.includes('Help') || itemName.includes('Docs')) {
      targetTab = 'help';
    }
    this.router.navigate(['/post_login/profile'], { queryParams: { tab: targetTab } });
  }

  // Sign Out Handler
  signOut(): void {
    this.isProfileDropdownOpen = false;
    this.authService.logout();
    this.router.navigate(['/pre-login/login']);
  }

  // Handle Logo Fallback
  onLogoError(event: any): void {
    event.target.src = this.sbmLogoSvgPath;
  }

  // Action for "More ->" button on each card:
  handleCardMore(cat: ApiCategory): void {
    if (cat.id === 'safaricom') {
      // Navigate to sandbox page with Safaricom API keys
      this.router.navigate(['/post_login/sandbox'], { queryParams: { api: 'safaricom' } });
    } else {
      this.triggerToast(`${cat.name} Coming Soon!`);
    }
  }

  closeModal(): void {
    this.selectedCategoryModal = null;
    this.testedEndpointResult = null;
  }

  // Test Endpoint Request invoking backend service or structured sandbox fallback
  simulateEndpointTest(ep: { path: string; name: string }): void {
    this.isTestingEndpoint = true;
    this.testedEndpointResult = null;

    // Execute backend call via SbmBankApiService
    this.sbmApiService.triggerStkPush({
      phoneNumber: '254712345678',
      amount: 1500,
      accountReference: 'SBM-PAY',
      transactionDesc: ep.name
    }).subscribe({
      next: (res) => {
        this.isTestingEndpoint = false;
        this.testedEndpointResult = {
          path: ep.path,
          name: ep.name,
          status: 200,
          duration: 32,
          responseJson: JSON.stringify(res, null, 2)
        };
      },
      error: () => {
        // Structured sandbox fallback when backend server is offline
        setTimeout(() => {
          this.isTestingEndpoint = false;
          this.testedEndpointResult = {
            path: ep.path,
            name: ep.name,
            status: 200,
            duration: Math.floor(Math.random() * 25) + 20,
            responseJson: JSON.stringify(
              {
                status: 'SUCCESS',
                code: 200,
                message: `SBM Bank Kenya Sandbox response for ${ep.name}`,
                data: {
                  transactionId: 'SBM-' + Math.floor(100000000 + Math.random() * 900000000),
                  environment: 'SANDBOX',
                  timestamp: new Date().toISOString(),
                  accountHolder: this.userProfile.name,
                  clearingStatus: 'PROCESSED'
                }
              },
              null,
              2
            )
          };
        }, 500);
      }
    });
  }

  triggerToast(msg: string): void {
    this.notificationMessage = msg;
    this.showNotificationToast = true;
    setTimeout(() => {
      this.showNotificationToast = false;
    }, 3500);
  }
}
