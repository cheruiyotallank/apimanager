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

@Injectable({
  providedIn: 'root'
})
export class SbmBankApiService {

  constructor(private apiService: ApiService) {}

  // ==========================================================================
  // 1. SAFARICOM M-PESA INTEGRATION API SUITE
  // ==========================================================================
  
  public triggerStkPush(payload: StkPushPayload): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.SAFARICOM.STK_PUSH, payload);
  }

  public disburseB2c(payload: B2cPayload): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.SAFARICOM.B2C_DISBURSE, payload);
  }

  public registerC2bCallback(callbackUrl: string): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.SAFARICOM.C2B_REGISTER, { callbackUrl });
  }

  public queryAccountBalance(): Observable<ApiResponse<any>> {
    return this.apiService.get<ApiResponse<any>>(API_ENDPOINTS.SAFARICOM.ACCOUNT_BALANCE);
  }

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
  // 6. CARD SERVICES SUITE
  // ==========================================================================

  public issueVirtualCard(payload: any): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.CARDS.VIRTUAL_ISSUE, payload);
  }

  // ==========================================================================
  // 7. DEVELOPER PROFILE & API KEYS MANAGEMENT SUITE
  // ==========================================================================

  public getProfileDetails(): Observable<ApiResponse<any>> {
    return this.apiService.get<ApiResponse<any>>(API_ENDPOINTS.PROFILE.GET_PROFILE);
  }

  public getApiKeys(): Observable<ApiResponse<any>> {
    return this.apiService.get<ApiResponse<any>>(API_ENDPOINTS.PROFILE.GET_API_KEYS);
  }

  public generateApiKey(keyName: string): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.PROFILE.GENERATE_API_KEY, { keyName });
  }

  public revokeApiKey(keyId: string): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(API_ENDPOINTS.PROFILE.REVOKE_API_KEY, { keyId });
  }
}
