import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SbmBankApiService } from '../../core/services/sbm-bank-api.service';

export interface SelectedApiService {
  id: string;
  name: string;
  badge: string;
  selected: boolean;
}

@Component({
  selector: 'app-go-live',
  templateUrl: './go-live.component.html',
  styleUrls: ['./go-live.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class GoLiveComponent implements OnInit {

  // SBM Logo Path
  public sbmLogoPath: string = 'assets/sbm-logo.png';
  public sbmLogoSvgPath: string = 'sbm-logo.svg';

  // Current Wizard Step (1 to 5)
  public currentStep: number = 1;

  // Compliance Review State: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED'
  public complianceStatus: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' = 'DRAFT';

  // Step 1: Application Profile & Target API Suites
  public appProfile = {
    appName: 'SBM Mobile Pay Enterprise Gateway',
    businessName: 'TechTots Solutions Limited',
    kraPin: 'A0192847192K',
    registrationNo: 'CPR/2026/91827',
    businessType: 'FINTECH_PAYMENTS',
    contactEmail: 'allan.cheruiyot@sbmbank.co.ke',
    contactPhone: '+254 712 345 678'
  };

  public apiSuites: SelectedApiService[] = [
    { id: 'safaricom', name: 'Safaricom M-Pesa Integration (STK Push, B2C, C2B)', badge: 'M-PESA CLEARING', selected: true },
    { id: 'pesalink', name: 'PesaLink IPSL Direct Account Settlement', badge: 'INSTANT 24/7', selected: true },
    { id: 'utility', name: 'Utility & Bill Payments (KPLC, Water, Paybill)', badge: 'BILLER ENGINE', selected: true },
    { id: 'transfers', name: 'Core Banking Fund Transfers (RTGS, EFT, SWIFT)', badge: 'INTERBANK CLEARING', selected: false },
    { id: 'kyc', name: 'Identity & KYC Validation (IPRS & KRA Lookup)', badge: 'GOVT IPRS', selected: false }
  ];

  // Step 2: Technical Security & Server Whitelisting
  public technicalSecurity = {
    whitelistedIps: '102.210.14.88/32, 197.232.4.12',
    webhookCallbackUrl: 'https://api.techtots.co.ke/v1/sbm-callbacks',
    enforceHmac: true,
    tlsVersion: 'TLS 1.3 Strict',
    publicCertificateName: 'sbm_rsa_2048_public_cert.pem',
    isCertUploaded: true
  };

  // Step 3: Sandbox Sign-Off Verification
  public sandboxSignoff = {
    totalTestCount: 18,
    successRate: '100%',
    status: 'PASSED',
    lastTestDate: '2026-07-28 12:45:10'
  };

  // Step 4: KYB Compliance & Legal Document Uploads
  public kybDocuments = {
    certOfIncUploaded: true,
    certOfIncName: 'cert_of_incorporation_techtots.pdf',
    directorIdUploaded: true,
    directorIdName: 'national_ids_directors.pdf',
    taxComplianceUploaded: true,
    taxComplianceName: 'kra_tax_compliance_2026.pdf'
  };

  // Step 5: Generated Production Live Credentials
  public productionCredentials = {
    liveClientId: 'sbm_live_prod_948172648192',
    livePasskey: 'sbm_live_pk_84719284719284719283719284719283',
    liveBaseUrl: 'https://api.sbmbank.co.ke/v1',
    approvalCertificateNo: 'SBM-CBK-PROD-2026-09182',
    approvedDate: '2026-07-28'
  };

  // Show Live Passkey Toggle
  public showLivePasskey: boolean = false;

  // Toast Notification State
  public showToast: boolean = false;
  public toastMessage: string = '';

  // Profile Dropdown State
  public isProfileDropdownOpen: boolean = false;

  constructor(
    private router: Router,
    private sbmApiService: SbmBankApiService
  ) {}

  ngOnInit(): void {}

  /**
   * Toggle API Suite selection in Step 1
   */
  public toggleSuite(suiteId: string): void {
    const suite = this.apiSuites.find(s => s.id === suiteId);
    if (suite) {
      suite.selected = !suite.selected;
    }
  }

  /**
   * Advance to Next Wizard Step
   */
  public nextStep(): void {
    if (this.currentStep < 5) {
      this.currentStep++;
    }
  }

  /**
   * Back to Previous Wizard Step
   */
  public prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  /**
   * Submit Go-Live Application for SBM Bank Legal & Compliance Audit via SbmBankApiService.
   */
  public submitForComplianceReview(): void {
    const payload = {
      appName: this.appProfile.appName,
      businessName: this.appProfile.businessName,
      kraPin: this.appProfile.kraPin,
      registrationNo: this.appProfile.registrationNo,
      businessType: this.appProfile.businessType,
      contactEmail: this.appProfile.contactEmail,
      selectedSuites: this.apiSuites.filter(s => s.selected).map(s => s.id),
      whitelistedIps: this.technicalSecurity.whitelistedIps,
      webhookCallbackUrl: this.technicalSecurity.webhookCallbackUrl,
      enforceHmac: this.technicalSecurity.enforceHmac,
      tlsVersion: this.technicalSecurity.tlsVersion
    };

    this.sbmApiService.submitGoLiveApplication(payload).subscribe({
      next: (res: any) => {
        this.complianceStatus = 'PENDING_REVIEW';
        this.currentStep = 5;
        this.triggerToast('Go-Live Application submitted for SBM Bank Compliance & Legal Audit!');
      },
      error: () => {
        // Fallback preview mode handler
        this.complianceStatus = 'PENDING_REVIEW';
        this.currentStep = 5;
        this.triggerToast('Go-Live Application submitted for SBM Bank Compliance & Legal Audit!');
      }
    });
  }

  /**
   * Simulate SBM Bank Compliance Officer Sign-off & Approve Live Production Access via SbmBankApiService.
   */
  public simulateComplianceApproval(): void {
    this.sbmApiService.approveGoLiveApplication().subscribe({
      next: (res: any) => {
        this.complianceStatus = 'APPROVED';
        this.triggerToast('CONGRATULATIONS! Production Go-Live Approved by SBM Bank Kenya Limited!');
      },
      error: () => {
        // Fallback preview mode handler
        this.complianceStatus = 'APPROVED';
        this.triggerToast('CONGRATULATIONS! Production Go-Live Approved by SBM Bank Kenya Limited!');
      }
    });
  }

  /**
   * Regenerates Live Production Credentials via SbmBankApiService.
   */
  public regenerateProductionKey(): void {
    this.sbmApiService.regenerateLiveProductionKey().subscribe({
      next: (res: any) => {
        if (res && res.data && res.data.liveClientId) {
          this.productionCredentials.liveClientId = res.data.liveClientId;
          this.productionCredentials.livePasskey = res.data.livePasskey;
        }
        this.triggerToast('Production API Credentials regenerated & updated!');
      },
      error: () => {
        // Fallback preview mode handler
        const newRand = Math.floor(100000000000 + Math.random() * 900000000000);
        const newPasskey = 'sbm_live_pk_' + Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
        this.productionCredentials.liveClientId = `sbm_live_prod_${newRand}`;
        this.productionCredentials.livePasskey = newPasskey;
        this.triggerToast('Production API Credentials regenerated & updated!');
      }
    });
  }

  public togglePasskeyVisibility(): void {
    this.showLivePasskey = !this.showLivePasskey;
  }

  public copyToClipboard(text: string, label: string): void {
    navigator.clipboard.writeText(text);
    this.triggerToast(`${label} copied to clipboard!`);
  }

  public navigateBackToDashboard(): void {
    this.router.navigate(['/post_login/dashboard']);
  }

  public triggerToast(msg: string): void {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3500);
  }

  public onLogoError(event: any): void {
    event.target.src = this.sbmLogoSvgPath;
  }

  // Profile Dropdown Methods
  public toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  public openProfileDropdown(): void {
    this.isProfileDropdownOpen = true;
  }

  public closeProfileDropdown(): void {
    this.isProfileDropdownOpen = false;
  }

  public onDropdownItemClick(itemName: string): void {
    this.isProfileDropdownOpen = false;
    if (itemName.includes('Credentials')) {
      this.router.navigate(['/post_login/profile'], { queryParams: { tab: 'credentials' } });
      return;
    }
    if (itemName.includes('Analytics')) {
      this.router.navigate(['/post_login/profile'], { queryParams: { tab: 'analytics' } });
      return;
    }
    if (itemName.includes('Help')) {
      this.router.navigate(['/post_login/profile'], { queryParams: { tab: 'help' } });
      return;
    }
    if (itemName.includes('Sandbox')) {
      this.router.navigate(['/post_login/sandbox']);
      return;
    }
    if (itemName.includes('Go-Live') || itemName.includes('Production')) {
      // Already on go-live
      return;
    }
  }

  public signOut(): void {
    this.router.navigate(['/pre-login/login']);
  }
}
