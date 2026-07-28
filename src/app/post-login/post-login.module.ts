import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PostLoginRoutingModule } from './post-login-routing.module';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PostLoginRoutingModule
  ]
})
export class PostLoginModule {}
