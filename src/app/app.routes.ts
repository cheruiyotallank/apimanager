import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

/**
 * ============================================================================
 * APPLICATION ROUTING DEFINITION (app.routes.ts)
 * ============================================================================
 * Maps URL paths to lazy-loaded modules protected with authentication guards.
 * - '': Redirects root visits automatically to pre-login authentication
 * - 'pre-login': Lazy loads PreLoginModule (login, signup, forgot-password)
 * - 'post_login': Lazy loads PostLoginModule protected with authGuard
 * ============================================================================
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pre-login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    redirectTo: 'post_login/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'pre-login',
    loadChildren: () => import('./pre-login/pre-login.module').then(m => m.PreLoginModule)
  },
  {
    path: 'post_login',
    canActivate: [authGuard],
    loadChildren: () => import('./post-login/post-login.module').then(m => m.PostLoginModule)
  },
  {
    path: '**',
    redirectTo: 'pre-login'
  }
];
