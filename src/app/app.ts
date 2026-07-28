import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationStart } from '@angular/router';

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
    // Always redirect to login on page refresh
    this.router.navigate(['/pre-login']);

    // Disable browser back and forward buttons completely
    this.disableBrowserBackButton();

    // Block router back navigation
    this.blockRouterBackNavigation();
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
