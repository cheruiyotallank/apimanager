import { environment } from '../../../environments/environment';

/**
 * ============================================================================
 * SBM BANK CENTRALISED BACKEND ENDPOINTS CONFIGURATION (api-endpoints.config.ts)
 * ============================================================================
 * Centralized dictionary holding all SBM Bank Kenya API endpoint URL routes.
 * Modifying route paths here updates all Angular API services across the app.
 * ============================================================================
 */

export const BASE_API_URL: string = environment.apiUrl || 'https://sandbox.api.sbmbank.co.ke';

export const API_ENDPOINTS = {

  /**
   * =========================================================================
   * 1. AUTHENTICATION & USER SESSION ENDPOINTS
   * =========================================================================
   */
  AUTH: {
    LOGIN: '/v1/auth/login',                  // POST: Authenticate email/password credentials
    REGISTER: '/v1/auth/register',            // POST: Register new developer account
    VERIFY_EMAIL: '/v1/auth/verify-email',    // POST: Confirm email verification token
    VERIFY_MFA: '/v1/auth/verify-mfa',        // POST: Validate 6-digit MFA OTP security code
    CHANGE_PASSWORD: '/v1/auth/change-password', // POST: Password update endpoint
    FORGOT_PASSWORD: '/v1/auth/forgot-password', // POST: Send password reset link
    RESEND_OTP: '/v1/auth/resend-otp',        // POST: Request new OTP security code
    LOGOUT: '/v1/auth/logout',                // POST: Terminate active JWT session
    USER_PROFILE: '/v1/auth/profile'          // GET: Fetch current user profile details
  },

  /**
   * =========================================================================
   * 2. SAFARICOM M-PESA INTEGRATION SUITE ENDPOINTS
   * =========================================================================
   */
  SAFARICOM: {
    STK_PUSH: '/v1/safaricom/stk-push',              // POST: Trigger Lipa Na M-Pesa Online SIM prompt
    B2C_DISBURSE: '/v1/safaricom/b2c-disburse',      // POST: Send B2C payment to customer phone
    C2B_REGISTER: '/v1/safaricom/c2b-register',      // POST: Register Paybill/Till Webhook Listener URLs
    ACCOUNT_BALANCE: '/v1/safaricom/account-balance',// GET: Query Safaricom M-Pesa working float
    TRANSACTION_STATUS: '/v1/safaricom/transaction-status' // POST: Requery M-Pesa payment status
  },

  /**
   * =========================================================================
   * 3. PESALINK IPSL INTERBANK TRANSFER ENDPOINTS
   * =========================================================================
   */
  PESALINK: {
    SEND_TO_ACCOUNT: '/v1/pesalink/send-to-account', // POST: Transfer to interbank account number
    SEND_TO_PHONE: '/v1/pesalink/send-to-phone',     // POST: Transfer to mobile phone number via IPSL
    ACCOUNT_LOOKUP: '/v1/pesalink/account-lookup',   // POST: Validate beneficiary account & name
    QUERY_STATUS: '/v1/pesalink/query-status',       // GET: Check IPSL clearing settlement status
    PARTICIPATING_BANKS: '/v1/pesalink/participating-banks' // GET: Fetch list of participating IPSL banks
  },

  /**
   * =========================================================================
   * 4. BILLING & UTILITY PAYMENTS SUITE ENDPOINTS
   * =========================================================================
   */
  UTILITY: {
    KPLC_TOKENS: '/v1/utility/kplc-tokens',    // POST: Purchase prepaid electricity tokens
    WATER_BILL: '/v1/utility/water-bill',      // POST: Pay Nairobi/County water utility bills
    AIRTIME_TOPUP: '/v1/utility/airtime-topup',// POST: Top up Safaricom/Airtel/Telkom airtime
    PAYBILL_QUERY: '/v1/utility/paybill-query',// GET: Lookup utility bill outstanding balance
    TV_SUBSCRIPTION: '/v1/utility/tv-subscription' // POST: Renew DSTV/GOtv/StarTimes subscriptions
  },

  /**
   * =========================================================================
   * 5. CORE BANKING FUND TRANSFER ENDPOINTS
   * =========================================================================
   */
  FUND_TRANSFER: {
    RTGS_EXPRESS: '/v1/transfer/rtgs-express',        // POST: High-value RTGS interbank clearing
    EFT_BATCH: '/v1/transfer/eft-batch',              // POST: Bulk overnight EFT payroll transfer
    INTERNAL_TRANSFER: '/v1/transfer/internal',        // POST: Zero-fee SBM account-to-account transfer
    SWIFT_WIRE: '/v1/transfer/swift-wire',            // POST: Cross-border SWIFT international wire
    FOREX_RATES: '/v1/transfer/forex-rates'           // GET: Live FX exchange rates (USD/KES, EUR/KES)
  },

  /**
   * =========================================================================
   * 6. IDENTITY VERIFICATION & KYC ENDPOINTS
   * =========================================================================
   */
  KYC: {
    NATIONAL_ID: '/v1/kyc/national-id',   // POST: Verify ID against Government IPRS database
    KRA_PIN: '/v1/kyc/kra-pin',           // POST: Validate tax compliance & registered taxpayer name
    CRB_CHECK: '/v1/kyc/crb-check',       // POST: Query TransUnion/Metropol credit score profile
    AML_SCREENING: '/v1/kyc/aml-screening'// POST: Real-time PEP & OFAC sanction list check
  },

  /**
   * =========================================================================
   * 7. SBM VISA & MASTERCARD CARD SERVICES ENDPOINTS
   * =========================================================================
   */
  CARDS: {
    VIRTUAL_ISSUE: '/v1/cards/virtual-issue',  // POST: Issue new virtual Visa/Mastercard card
    BLOCK_UNBLOCK: '/v1/cards/block-unblock',  // POST: Freeze or unblock payment card
    TRANSACTIONS: '/v1/cards/transactions',    // GET: Fetch card transaction statement history
    AUTH_3DS: '/v1/cards/3ds-auth'             // POST: 3D Secure OTP authentication
  },

  /**
   * =========================================================================
   * 8. SANDBOX PLAYGROUND & API TEST CONSOLE ENDPOINTS
   * =========================================================================
   */
  SANDBOX: {
    OAUTH_TOKEN: '/v1/sandbox/oauth/generate',       // GET: Generate fresh Sandbox OAuth Bearer token
    STK_SIMULATOR: '/v1/sandbox/stkpush/simulate',    // POST: Simulate Lipa Na M-Pesa STK Push request
    B2C_SIMULATOR: '/v1/sandbox/b2c/simulate',        // POST: Simulate B2C fund disbursal payment
    C2B_REGISTER: '/v1/sandbox/c2b/register-url',     // POST: Register Sandbox webhook callback listener
    WEBHOOK_EVENTS: '/v1/sandbox/webhook-events'      // GET: Stream incoming mock callback JSON payloads
  },

  /**
   * =========================================================================
   * 9. GO-LIVE PRODUCTION WIZARD & COMPLIANCE AUDIT ENDPOINTS
   * =========================================================================
   */
  GO_LIVE: {
    SUBMIT_APPLICATION: '/v1/golive/submit-application', // POST: Submit 5-step Go-Live onboarding application
    CHECK_STATUS: '/v1/golive/compliance-status',        // GET: Fetch SBM Legal & Security Audit status
    APPROVE_APPLICATION: '/v1/golive/approve-access',    // POST: Sign off & grant PROD APPROVED status
    UPLOAD_DOCUMENT: '/v1/golive/upload-kyb-doc',        // POST: Upload Certificate of Incorporation/KYB
    REGENERATE_KEYS: '/v1/golive/regenerate-prod-keys'   // POST: Regenerate Production Client ID & Passkey
  },

  /**
   * =========================================================================
   * 10. DEVELOPER PROFILE & API KEYS MANAGEMENT ENDPOINTS
   * =========================================================================
   */
  PROFILE: {
    GET_PROFILE: '/v1/profile/details',             // GET: Fetch developer account details
    UPDATE_PROFILE: '/v1/profile/update',           // PUT: Update developer profile info
    REGENERATE_SANDBOX_KEY: '/v1/profile/sandbox-key/regenerate', // POST: Regenerate single Sandbox key
    REGENERATE_LIVE_KEY: '/v1/profile/live-key/regenerate',       // POST: Regenerate single Live Production key
    SAVE_PREFERENCES: '/v1/profile/developer-settings',           // PUT: Save developer system settings
    TELEMETRY_STATS: '/v1/profile/telemetry'        // GET: Fetch 30-day API call telemetry metrics
  }
};
