import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * ============================================================================
 * SBM BANK AUTHENTICATION GUARD (core/guards/auth.guard.ts)
 * ============================================================================
 * Protects authenticated routes (/post_login/dashboard, /post_login/profile).
 * Only allows users with a valid JWT token / active session. Unauthenticated
 * users are redirected to the login page.
 * ============================================================================
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Session expired or unauthenticated: redirect to login page
  return router.createUrlTree(['/pre-login'], { queryParams: { returnUrl: state.url } });
};
