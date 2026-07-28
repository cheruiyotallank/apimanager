import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { SandboxComponent } from './sandbox/sandbox.component';
import { GoLiveComponent } from './go-live/go-live.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'sandbox',
    component: SandboxComponent
  },
  {
    path: 'go-live',
    component: GoLiveComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostLoginRoutingModule {}
