import { Routes } from '@angular/router';

/**
 * ============================================================================
 * APPLICATION ROUTING DEFINITION (app.routes.ts)
 * ============================================================================
 * Maps URL paths to specific page components.
 * - 'login': Renders the LoginComponent
 * - '': Redirects root visits automatically to 'login'
 * ============================================================================
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pre-login/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pre-login/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'register',
    redirectTo: 'signup',
    pathMatch: 'full'
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pre-login/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

