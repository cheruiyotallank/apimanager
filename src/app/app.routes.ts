import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

/**
 * ============================================================================
 * APPLICATION ROUTING DEFINITION (app.routes.ts)
 * ============================================================================
 * Direct preview routing enabled for dashboard access without authenticating.
 * - '': Redirects root visits automatically to pre-login
 * - 'pre-login': Lazy loads PreLoginModule (login, signup, forgot-password)
 * - 'post_login': Lazy loads PostLoginModule
 * ============================================================================
 */
export const routes: Routes = [
  {
    path: 'pre-login',
    loadChildren: () => import('./pre-login/pre-login.module').then(m => m.PreLoginModule)
  },
  {
    path: '',
    redirectTo: 'pre-login',
    pathMatch: 'full'
  },
  {
    path: 'post_login',
    canActivate: [authGuard],
    loadChildren: () => import('./post-login/post-login.module').then(m => m.PostLoginModule)
  }
];
