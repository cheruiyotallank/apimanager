import { Routes } from '@angular/router';

/**
 * ============================================================================
 * APPLICATION ROUTING DEFINITION (app.routes.ts)
 * ============================================================================
 * Maps URL paths to lazy-loaded modules for better performance.
 * - '': Redirects root visits automatically to pre-login
 * - 'pre-login': Lazy loads PreLoginModule (login, signup, forgot-password)
 * - 'post_login': Lazy loads PostLoginModule (dashboard and authenticated features)
 * ============================================================================
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pre-login',
    pathMatch: 'full'
  },
  {
    path: 'pre-login',
    loadChildren: () => import('./pre-login/pre-login.module').then(m => m.PreLoginModule)
  },
  {
    path: 'post_login',
    loadChildren: () => import('./post-login/post-login.module').then(m => m.PostLoginModule)
  },
  {
    path: '**',
    redirectTo: 'pre-login'
  }
];

