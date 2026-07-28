import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

/**
 * ============================================================================
 * APPLICATION ROUTING DEFINITION (app.routes.ts)
 * ============================================================================
 * Direct preview routing enabled for dashboard access without authenticating.
 * - '': Redirects root visits automatically to post_login/dashboard
 * - 'dashboard': Redirects to post_login/dashboard
 * - 'pre-login': Lazy loads PreLoginModule (login, signup, forgot-password)
 * - 'post_login': Lazy loads PostLoginModule
 * ============================================================================
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'post_login',
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
    redirectTo: 'post_login'
  }
];
