import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PreLoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Use Navigation Timing API to detect if this is a page load/refresh
    const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const navType = navEntries.length > 0 ? navEntries[0].type : '';

    // If it's a navigate (direct URL) or reload (refresh), redirect to login
    if (navType === 'navigate' || navType === 'reload') {
      this.router.navigate(['/pre-login/login']);
      return false;
    }

    // Allow internal navigation
    return true;
  }
}
