import { environment } from '../../../environments/environment';

/**
 * ============================================================================
 * SBM BANK CENTRALISED BACKEND ENDPOINTS CONFIGURATION
 * ============================================================================
 * Centralized repository of all SBM Bank Kenya API endpoints for easy editing
 * and maintenance across environments (Sandbox, Staging, Production).
 * ============================================================================
 */

export const BASE_API_URL: string = environment.apiUrl || 'https://sandbox.api.sbmbank.co.ke';

export const API_ENDPOINTS = {
  // Authentication & Session Endpoints
  AUTH: {
    LOGIN: '/v1/auth/login',
    REGISTER: '/v1/auth/register',
    VERIFY_EMAIL: '/v1/auth/verify-email',
    VERIFY_MFA: '/v1/auth/verify-mfa',
    CHANGE_PASSWORD: '/v1/auth/change-password',
    FORGOT_PASSWORD: '/v1/auth/forgot-password',
    RESEND_OTP: '/v1/auth/resend-otp',
    LOGOUT: '/v1/auth/logout',
    USER_PROFILE: '/v1/auth/profile'
  },

  // Safaricom M-Pesa Integration Suite
  SAFARICOM: {
    STK_PUSH: '/v1/safaricom/stk-push',
    B2C_DISBURSE: '/v1/safaricom/b2c-disburse',
    C2B_REGISTER: '/v1/safaricom/c2b-register',
    ACCOUNT_BALANCE: '/v1/safaricom/account-balance',
    TRANSACTION_STATUS: '/v1/safaricom/transaction-status'
  },

  // PesaLink IPSL Interbank Transfer Suite
  PESALINK: {
    SEND_TO_ACCOUNT: '/v1/pesalink/send-to-account',
    SEND_TO_PHONE: '/v1/pesalink/send-to-phone',
    ACCOUNT_LOOKUP: '/v1/pesalink/account-lookup',
    QUERY_STATUS: '/v1/pesalink/query-status',
    PARTICIPATING_BANKS: '/v1/pesalink/participating-banks'
  },

  // Billing & Utility Payments Suite
  UTILITY: {
    KPLC_TOKENS: '/v1/utility/kplc-tokens',
    WATER_BILL: '/v1/utility/water-bill',
    AIRTIME_TOPUP: '/v1/utility/airtime-topup',
    PAYBILL_QUERY: '/v1/utility/paybill-query',
    TV_SUBSCRIPTION: '/v1/utility/tv-subscription'
  },

  // Core Banking Fund Transfer Suite
  FUND_TRANSFER: {
    RTGS_EXPRESS: '/v1/transfer/rtgs-express',
    EFT_BATCH: '/v1/transfer/eft-batch',
    INTERNAL_TRANSFER: '/v1/transfer/internal',
    SWIFT_WIRE: '/v1/transfer/swift-wire',
    FOREX_RATES: '/v1/transfer/forex-rates'
  },

  // Identity Verification & KYC Suite
  KYC: {
    NATIONAL_ID: '/v1/kyc/national-id',
    KRA_PIN: '/v1/kyc/kra-pin',
    CRB_CHECK: '/v1/kyc/crb-check',
    AML_SCREENING: '/v1/kyc/aml-screening'
  },

  // SBM Visa & Mastercard Card Services Suite
  CARDS: {
    VIRTUAL_ISSUE: '/v1/cards/virtual-issue',
    BLOCK_UNBLOCK: '/v1/cards/block-unblock',
    TRANSACTIONS: '/v1/cards/transactions',
    AUTH_3DS: '/v1/cards/3ds-auth'
  },

  // Developer Profile & API Keys Management
  PROFILE: {
    GET_PROFILE: '/v1/profile/details',
    UPDATE_PROFILE: '/v1/profile/update',
    GET_API_KEYS: '/v1/profile/api-keys',
    GENERATE_API_KEY: '/v1/profile/api-keys/generate',
    REVOKE_API_KEY: '/v1/profile/api-keys/revoke',
    TELEMETRY_STATS: '/v1/profile/telemetry'
  }
};
