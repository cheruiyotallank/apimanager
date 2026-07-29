import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('apimanager');
  private navigationHistory: string[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // SBM-style router initialization pattern
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      if (currentUrl === '/') {
        this.router.navigate(['']);
      }
      this.router.navigate([currentUrl]);
    });
  }

  blockRouterBackNavigation(): void {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        const currentUrl = this.router.url;
        this.navigationHistory.push(currentUrl);

        // If navigation is to a previous URL in history, block it
        if (this.navigationHistory.length > 1 && this.navigationHistory.includes(event.url)) {
          // Redirect back to current URL
          this.router.navigate([currentUrl]);
        }
      }
    });
  }

  disableBrowserBackButton(): void {
    // Push initial state
    history.pushState({ noBack: true }, '', location.href);

    // Continuous monitoring to block back button - faster interval
    const checkHistory = setInterval(() => {
      history.pushState({ noBack: true }, '', location.href);
    }, 10);

    window.onpopstate = (event: PopStateEvent) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      event.cancelBubble = true;
      // Immediately replace and push state back
      history.replaceState({ noBack: true }, '', location.href);
      history.pushState({ noBack: true }, '', location.href);
      history.pushState({ noBack: true }, '', location.href);
      // Force stay on current page
      setTimeout(() => history.go(0), 0);
    };

    // Store interval for cleanup
    (this as any).historyInterval = checkHistory;
  }

  ngOnDestroy(): void {
    window.onpopstate = null;
    if ((this as any).historyInterval) {
      clearInterval((this as any).historyInterval);
    }
  }
}
