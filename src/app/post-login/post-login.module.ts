import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PostLoginRoutingModule } from './post-login-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { SandboxComponent } from './sandbox/sandbox.component';
import { GoLiveComponent } from './go-live/go-live.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent,
    SandboxComponent,
    GoLiveComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PostLoginRoutingModule
  ]
})
export class PostLoginModule {}
