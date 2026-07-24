import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { provideRouter } from '@angular/router';

/**
 * Unit Test Spec for LoginComponent
 */
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the login component successfully', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility when togglePasswordVisibility is called', () => {
    expect(component.isPasswordVisible).toBe(false);
    component.togglePasswordVisibility();
    expect(component.isPasswordVisible).toBe(true);
    component.togglePasswordVisibility();
    expect(component.isPasswordVisible).toBe(false);
  });

  it('should show error message if submitted with empty credentials', () => {
    component.userCredentials.email = '';
    component.userCredentials.password = '';
    component.onLoginSubmit();
    expect(component.errorMessage).toBeTruthy();
  });

  it('should transition to MFA_VERIFICATION step on valid login submit', () => {
    component.userCredentials.email = 'developer@sbm.co.ke';
    component.userCredentials.password = 'P@ssw0rd123!';
    component.onLoginSubmit();
    expect(component.isSubmitting).toBe(true);
  });

  it('should trigger Google SSO login flow', () => {
    component.loginWithGoogle();
    expect(component.isSubmitting).toBe(true);
  });

  it('should trigger Enterprise SSO login flow', () => {
    component.loginWithSSO();
    expect(component.isSubmitting).toBe(true);
  });
});
