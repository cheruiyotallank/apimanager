import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../config/api-endpoints.config';
import { ApiResponse } from '../models/auth.models';

export interface StkPushPayload {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}

export interface B2cPayload {
  phoneNumber: string;
  amount: number;
  remarks: string;
  occasion?: string;
}

export interface PesaLinkTransferPayload {
  accountNumber: string;
  bankCode: string;
  amount: number;
  currency: string;
  narration: string;
}

export interface UtilityPaymentPayload {
  accountOrMeterNo: string;
  utilityType: 'KPLC' | 'WATER' | 'AIRTIME' | 'TV';
  amount: number;
}

export interface GoLiveApplicationPayload {
  appName: string;
  businessName: string;
  kraPin: string;
  registrationNo: string;
  businessType: string;
  contactEmail: string;
  selectedSuites: string[];
  whitelistedIps: string;
  webhookCallbackUrl: string;
  enforceHmac: boolean;
  tlsVersion: string;
}

@Injectable({
  providedIn: 'root'
})
export class SbmBankApiService {

  constructor(private apiService: ApiService) {}

  // ==========================================================================
  // 1. SAFARICOM M-PESA INTEGRATION API SUITE
  // ==========================================================================
  
  /**
   * Triggers Lipa Na M-Pesa Online STK Push request on customer phone.
   */
  public triggerStkPush(payload: StkPushPayload): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.SAFARICOM.STK_PUSH, payload);
  }

  /**
   * Disburses funds directly from Bank working float to customer M-Pesa.
   */
  public disburseB2c(payload: B2cPayload): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.SAFARICOM.B2C_DISBURSE, payload);
  }

  /**
   * Registers Paybill / Till Number C2B Webhook Listener URLs.
   */
  public registerC2bCallback(callbackUrl: string): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.SAFARICOM.C2B_REGISTER, { callbackUrl });
  }

  /**
   * Queries Safaricom M-Pesa floating balance.
   */
  public queryAccountBalance(): Observable<ApiResponse<any>> {
    return this.apiService.get<ApiResponse<any>>(API_ENDPOINTS.SAFARICOM.ACCOUNT_BALANCE);
  }

  /**
   * Requeries status of an M-Pesa payment by CheckoutRequestID.
   */
  public queryTransactionStatus(checkoutRequestId: string): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.SAFARICOM.TRANSACTION_STATUS, { checkoutRequestId });
  }

  // ==========================================================================
  // 2. PESALINK IPSL INTERBANK TRANSFER SUITE
  // ==========================================================================

  public sendPesaLinkToAccount(payload: PesaLinkTransferPayload): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.PESALINK.SEND_TO_ACCOUNT, payload);
  }

  public sendPesaLinkToPhone(phoneNumber: string, amount: number): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.PESALINK.SEND_TO_PHONE, { phoneNumber, amount });
  }

  public lookupAccount(accountNumber: string, bankCode: string): Observable<ApiResponse<any>> {
    return this.apiService.get<ApiResponse<any>>(`${API_ENDPOINTS.PESALINK.ACCOUNT_LOOKUP}?account=${accountNumber}&bank=${bankCode}`);
  }

  // ==========================================================================
  // 3. UTILITY & BILLING PAYMENTS SUITE
  // ==========================================================================

  public payUtilityBill(payload: UtilityPaymentPayload): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.UTILITY.PAYBILL_QUERY, payload);
  }

  // ==========================================================================
  // 4. CORE BANKING FUND TRANSFER SUITE
  // ==========================================================================

  public processRtgsExpress(payload: any): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.FUND_TRANSFER.RTGS_EXPRESS, payload);
  }

  public getForexRates(): Observable<ApiResponse<any>> {
    return this.apiService.get<ApiResponse<any>>(API_ENDPOINTS.FUND_TRANSFER.FOREX_RATES);
  }

  // ==========================================================================
  // 5. IDENTITY & KYC VERIFICATION SUITE
  // ==========================================================================

  public verifyNationalId(idNumber: string): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.KYC.NATIONAL_ID, { idNumber });
  }

  public verifyKraPin(pin: string): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.KYC.KRA_PIN, { pin });
  }

  // ==========================================================================
  // 6. SANDBOX PLAYGROUND & API TEST CONSOLE SUITE
  // ==========================================================================

  /**
   * Generates a fresh Sandbox OAuth 2.0 Bearer access token.
   */
  public generateSandboxOAuthToken(): Observable<ApiResponse<any>> {
    return this.apiService.get<ApiResponse<any>>(API_ENDPOINTS.SANDBOX.OAUTH_TOKEN);
  }

  /**
   * Executes a simulated STK Push request in the Sandbox environment.
   */
  public executeSandboxStkPush(payload: StkPushPayload): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.SANDBOX.STK_SIMULATOR, payload);
  }

  /**
   * Executes a simulated B2C fund transfer request in the Sandbox environment.
   */
  public executeSandboxB2C(payload: B2cPayload): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.SANDBOX.B2C_SIMULATOR, payload);
  }

  /**
   * Streams incoming mock webhook callback event logs in real time.
   */
  public getSandboxWebhookLogs(): Observable<ApiResponse<any>> {
    return this.apiService.get<ApiResponse<any>>(API_ENDPOINTS.SANDBOX.WEBHOOK_EVENTS);
  }

  // ==========================================================================
  // 7. GO-LIVE PRODUCTION WIZARD & COMPLIANCE AUDIT SUITE
  // ==========================================================================

  /**
   * Submits a 5-step Go-Live onboarding application for SBM Compliance Audit.
   */
  public submitGoLiveApplication(payload: GoLiveApplicationPayload): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.GO_LIVE.SUBMIT_APPLICATION, payload);
  }

  /**
   * Checks SBM Bank Compliance Officer review status (PENDING_REVIEW / APPROVED).
   */
  public fetchGoLiveComplianceStatus(): Observable<ApiResponse<any>> {
    return this.apiService.get<ApiResponse<any>>(API_ENDPOINTS.GO_LIVE.CHECK_STATUS);
  }

  /**
   * Signs off & grants PROD APPROVED live production gateway access.
   */
  public approveGoLiveApplication(): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.GO_LIVE.APPROVE_APPLICATION, {});
  }

  /**
   * Uploads KYB Verification Documents (Certificate of Incorporation, IDs).
   */
  public uploadKybDocument(documentType: string, file: any): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.GO_LIVE.UPLOAD_DOCUMENT, { documentType });
  }

  // ==========================================================================
  // 8. DEVELOPER PROFILE & API KEYS MANAGEMENT SUITE
  // ==========================================================================

  public getProfileDetails(): Observable<ApiResponse<any>> {
    return this.apiService.get<ApiResponse<any>>(API_ENDPOINTS.PROFILE.GET_PROFILE);
  }

  /**
   * Regenerates single active Sandbox Client ID & HMAC Secret Key.
   */
  public regenerateSandboxKey(): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.PROFILE.REGENERATE_SANDBOX_KEY, {});
  }

  /**
   * Regenerates single active Live Production Client ID & Passkey.
   */
  public regenerateLiveProductionKey(): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.PROFILE.REGENERATE_LIVE_KEY, {});
  }

  /**
   * Saves developer system preferences & gateway configurations.
   */
  public saveDeveloperPreferences(preferences: any): Observable<ApiResponse<any>> {
    return this.apiService.put<ApiResponse<any>>(API_ENDPOINTS.PROFILE.SAVE_PREFERENCES, preferences);
  }
}
