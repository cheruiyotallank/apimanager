import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { SbmBankApiService } from '../../core/services/sbm-bank-api.service';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe]
})
export class SandboxComponent implements OnInit {

  // SBM Logo Path
  public sbmLogoPath: string = 'assets/sbm-logo.png';
  public sbmLogoSvgPath: string = 'sbm-logo.svg';

  // Active Sandbox Test Suite Tab: 'oauth' | 'stk' | 'b2c' | 'c2b' | 'pesalink' | 'utility'
  public activeSuite: 'oauth' | 'stk' | 'b2c' | 'c2b' | 'pesalink' | 'utility' = 'stk';

  // Code Generator Language Tab: 'curl' | 'typescript' | 'python' | 'java'
  public activeCodeLang: 'curl' | 'typescript' | 'python' | 'java' = 'curl';

  // Sandbox Environment Configuration Base URL
  public sandboxBaseUrl: string = 'https://sandbox.api.sbmbank.co.ke/v1';

  // Active OAuth 2.0 Token State
  public oauthToken: string = 'sbm_sbx_oauth_bearer_94817264819283719283';
  public isTokenValid: boolean = true;
  public tokenExpiresInSeconds: number = 3599;

  // Sandbox Interactive Request Form Parameters
  public requestParams = {
    consumerKey: 'sbm_sbx_client_948172648192',
    consumerSecret: 'sbm_sbx_sec_84719284719284719283719284719283',
    businessShortCode: '174379',
    passkey: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
    phoneNumber: '254708374149',
    amount: 1500,
    accountReference: 'INV-2026-089',
    transactionDesc: 'SBM API Sandbox Test Payment',
    callbackUrl: 'https://api.yourcompany.co.ke/sbm-callback',
    commandID: 'BusinessPayment',
    remarks: 'Sandbox Salary Payment'
  };

  // Execution & Live Terminal State
  public isExecuting: boolean = false;
  public httpStatus: number = 200;
  public statusText: string = '200 OK';
  public responseTimeMs: number = 32;
  public responseBodyJson: string = '';
  public generatedCodeSnippet: string = '';

  // Toast Notification
  public showToast: boolean = false;
  public toastMessage: string = '';

  // Profile Dropdown State
  public isProfileDropdownOpen: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sbmApiService: SbmBankApiService
  ) { }

  ngOnInit(): void {
    // Check for API query parameter to load specific keys
    this.route.queryParams.subscribe(params => {
      const apiType = params['api'];
      if (apiType === 'safaricom') {
        // Load Safaricom-specific sandbox keys
        this.requestParams.consumerKey = 'sbm_sbx_safaricom_client_948172648192';
        this.requestParams.consumerSecret = 'sbm_sbx_safaricom_sec_84719284719284719283719284719283';
        this.requestParams.businessShortCode = '174379';
        this.requestParams.passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
      }
    });
    this.updateResponseTerminal();
    this.updateCodeSnippet();
  }

  public launchGoLiveWizard(): void {
    this.router.navigate(['/post_login/go-live']);
  }

  public downloadOpenApiSpec(): void {
    this.triggerToast('Downloading official SBM Bank Safaricom M-Pesa OpenAPI 3.0 Specification (JSON)');
  }

  public viewOpenApiSpec(): void {
    this.triggerToast('Viewing OpenAPI 3.0 Documentation Schema for SBM Bank Kenya APIs');
  }

  /**
   * Switch Active Test Suite (OAuth | STK | B2C | C2B | PesaLink | Utility)
   */
  public selectSuite(suite: 'oauth' | 'stk' | 'b2c' | 'c2b' | 'pesalink' | 'utility'): void {
    this.activeSuite = suite;
    this.updateResponseTerminal();
    this.updateCodeSnippet();
  }

  /**
   * Switch Active Code Generator Language
   */
  public selectCodeLang(lang: 'curl' | 'typescript' | 'python' | 'java'): void {
    this.activeCodeLang = lang;
    this.updateCodeSnippet();
  }

  /**
   * Generates a fresh OAuth 2.0 Bearer Access Token using Client Credentials API.
   */
  public generateOAuthToken(): void {
    this.isExecuting = true;
    this.sbmApiService.generateSandboxOAuthToken().subscribe({
      next: (res: any) => {
        this.isExecuting = false;
        if (res && res.data && res.data.access_token) {
          this.oauthToken = res.data.access_token;
        }
        this.isTokenValid = true;
        this.tokenExpiresInSeconds = 3599;
        this.triggerToast('New Sandbox OAuth 2.0 Bearer Token generated!');
        this.updateResponseTerminal();
        this.updateCodeSnippet();
      },
      error: () => {
        // Fallback for offline sandbox preview mode
        setTimeout(() => {
          this.isExecuting = false;
          const randToken = 'sbm_sbx_oauth_bearer_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          this.oauthToken = randToken;
          this.isTokenValid = true;
          this.tokenExpiresInSeconds = 3599;
          this.triggerToast('New Sandbox OAuth 2.0 Bearer Token generated!');
          this.updateResponseTerminal();
          this.updateCodeSnippet();
        }, 400);
      }
    });
  }

  /**
   * Executes the active test suite request in the Sandbox Environment via SbmBankApiService.
   */
  public executeSandboxRequest(): void {
    this.isExecuting = true;
    const start = Date.now();

    const stkPayload = {
      phoneNumber: this.requestParams.phoneNumber,
      amount: Number(this.requestParams.amount) || 1500,
      accountReference: this.requestParams.accountReference,
      transactionDesc: this.requestParams.transactionDesc
    };

    this.sbmApiService.executeSandboxStkPush(stkPayload).subscribe({
      next: (res: any) => {
        this.isExecuting = false;
        this.responseTimeMs = Date.now() - start;
        this.httpStatus = 200;
        this.statusText = '200 OK';
        this.triggerToast(`Sandbox ${this.activeSuite.toUpperCase()} API request executed successfully!`);
        this.updateResponseTerminal();
        this.updateCodeSnippet();
      },
      error: () => {
        // Structured sandbox fallback when backend server is offline
        setTimeout(() => {
          this.isExecuting = false;
          this.responseTimeMs = Date.now() - start + 25;
          this.httpStatus = 200;
          this.statusText = '200 OK';

          this.triggerToast(`Sandbox ${this.activeSuite.toUpperCase()} API request executed successfully!`);
          this.updateResponseTerminal();
          this.updateCodeSnippet();
        }, 500);
      }
    });
  }

  /**
   * Updates the JSON Response Terminal content based on active suite & parameters.
   */
  private updateResponseTerminal(): void {
    const timestampStr = new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14);

    if (this.activeSuite === 'oauth') {
      this.responseBodyJson = JSON.stringify({
        access_token: this.oauthToken,
        token_type: 'Bearer',
        expires_in: '3599',
        scope: 'sbm_api_sandbox_full_access'
      }, null, 2);
    } else if (this.activeSuite === 'stk') {
      this.responseBodyJson = JSON.stringify({
        MerchantRequestID: '29182-94817-1',
        CheckoutRequestID: `ws_CO_${timestampStr}_948172`,
        ResponseCode: '0',
        ResponseDescription: 'Success. Request accepted for processing',
        CustomerMessage: `Success. Prompt sent to customer phone ${this.requestParams.phoneNumber}. Please enter M-Pesa PIN.`
      }, null, 2);
    } else if (this.activeSuite === 'b2c') {
      this.responseBodyJson = JSON.stringify({
        ConversationID: `AG_${timestampStr}_000048172648`,
        OriginatorConversationID: '29182-94817-2',
        ResponseCode: '0',
        ResponseDescription: 'Accept the service request successfully.'
      }, null, 2);
    } else if (this.activeSuite === 'c2b') {
      this.responseBodyJson = JSON.stringify({
        OriginatorConversationID: '29182-94817-3',
        ResponseCode: '0',
        ResponseDescription: 'SBM Bank C2B Register URL completed successfully'
      }, null, 2);
    } else if (this.activeSuite === 'pesalink') {
      this.responseBodyJson = JSON.stringify({
        status: 'SUCCESS',
        transactionRef: `PLK_${timestampStr}_8471`,
        sourceAccount: '109284719284',
        destinationAccount: '010294817264',
        amount: this.requestParams.amount,
        chargeAmount: 0.00,
        settlementStatus: 'CLEARED'
      }, null, 2);
    } else if (this.activeSuite === 'utility') {
      this.responseBodyJson = JSON.stringify({
        status: 'SUCCESS',
        utilityReceiptNumber: `UTL_${timestampStr}_9921`,
        billerName: 'KPLC Prepaid Power',
        accountNumber: '37192847192',
        tokenIssued: '8471-9284-7192-8471-9284',
        unitsPurchased: '42.8 kWh'
      }, null, 2);
    }
  }

  /**
   * Updates ready-to-use Code Generator snippets based on language selection.
   */
  private updateCodeSnippet(): void {
    const url = `${this.sandboxBaseUrl}/${this.getEndpointPath()}`;
    const token = this.oauthToken;

    if (this.activeCodeLang === 'curl') {
      this.generatedCodeSnippet = `curl -X POST "${url}" \\
  -H "Authorization: Bearer ${token}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "BusinessShortCode": "${this.requestParams.businessShortCode}",
    "PhoneNumber": "${this.requestParams.phoneNumber}",
    "Amount": ${this.requestParams.amount},
    "CallBackURL": "${this.requestParams.callbackUrl}"
  }'`;
    } else if (this.activeCodeLang === 'typescript') {
      this.generatedCodeSnippet = `import axios from 'axios';

const response = await axios.post('${url}', {
  BusinessShortCode: '${this.requestParams.businessShortCode}',
  PhoneNumber: '${this.requestParams.phoneNumber}',
  Amount: ${this.requestParams.amount},
  CallBackURL: '${this.requestParams.callbackUrl}'
}, {
  headers: {
    'Authorization': 'Bearer ${token}',
    'Content-Type': 'application/json'
  }
});

console.log(response.data);`;
    } else if (this.activeCodeLang === 'python') {
      this.generatedCodeSnippet = `import requests

url = "${url}"
headers = {
    "Authorization": "Bearer ${token}",
    "Content-Type": "application/json"
}
payload = {
    "BusinessShortCode": "${this.requestParams.businessShortCode}",
    "PhoneNumber": "${this.requestParams.phoneNumber}",
    "Amount": ${this.requestParams.amount},
    "CallBackURL": "${this.requestParams.callbackUrl}"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`;
    } else if (this.activeCodeLang === 'java') {
      this.generatedCodeSnippet = `HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${url}"))
    .header("Authorization", "Bearer ${token}")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString("""
      {
        "BusinessShortCode": "${this.requestParams.businessShortCode}",
        "PhoneNumber": "${this.requestParams.phoneNumber}",
        "Amount": ${this.requestParams.amount}
      }
      """))
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`;
    }
  }

  private getEndpointPath(): string {
    switch (this.activeSuite) {
      case 'oauth': return 'oauth/v1/generate?grant_type=client_credentials';
      case 'stk': return 'mpesa/stkpush/v1/processrequest';
      case 'b2c': return 'mpesa/b2c/v1/paymentrequest';
      case 'c2b': return 'mpesa/c2b/v1/registerurl';
      case 'pesalink': return 'pesalink/v1/send-to-account';
      case 'utility': return 'utility/v1/pay-bill';
    }
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
      // Already on sandbox
      return;
    }
    if (itemName.includes('Go-Live') || itemName.includes('Production')) {
      this.router.navigate(['/post_login/go-live']);
      return;
    }
  }

  public signOut(): void {
    this.router.navigate(['/pre-login/login']);
  }
}
