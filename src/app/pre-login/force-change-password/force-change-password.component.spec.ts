import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForceChangePasswordComponent } from './force-change-password.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../core/services/auth.service';

describe('ForceChangePasswordComponent', () => {
  let component: ForceChangePasswordComponent;
  let fixture: ComponentFixture<ForceChangePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ForceChangePasswordComponent,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [AuthService]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ForceChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the force change password component', () => {
    expect(component).toBeTruthy();
  });
});
