import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
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
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Session expired or unauthenticated: redirect to login page
  return router.createUrlTree(['/pre-login/login'], { queryParams: { returnUrl: state.url } });
};
