import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * ============================================================================
 * SBM BANK AUTHENTICATION GUARD (core/guards/auth.guard.ts)
 * ============================================================================
 * Configured for direct dashboard preview without requiring manual login.
 * Automatically saves active session fallback for Allan Cheruiyot.
 * ============================================================================
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  // If no active session exists, initialize default preview session for Allan Cheruiyot
  if (!authService.isLoggedIn()) {
    authService.saveSession({
      accessToken: 'sbm_sec_jwt_token_allan_cheruiyot_948172648',
      user: {
        id: 'usr_allan_01',
        firstName: 'Allan',
        lastName: 'Cheruiyot',
        email: 'allan.cheruiyot@sbmbank.co.ke',
        phone: '+254712345678',
        organizationName: 'SBM Bank Kenya',
        organizationType: 'Bank Administrator',
        country: 'Kenya',
        roles: ['ENTERPRISE_ADMIN']
      }
    });
  }

  return true;
};
