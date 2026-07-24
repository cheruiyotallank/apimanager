import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { provideRouter } from '@angular/router';

/**
 * Unit Test Spec for RegisterComponent
 */
describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the register component successfully', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password and confirm password visibility', () => {
    expect(component.isPasswordVisible).toBe(false);
    component.togglePasswordVisibility();
    expect(component.isPasswordVisible).toBe(true);

    expect(component.isConfirmPasswordVisible).toBe(false);
    component.toggleConfirmPasswordVisibility();
    expect(component.isConfirmPasswordVisible).toBe(true);
  });

  it('should show error if password and confirm password do not match', () => {
    component.registerData.firstName = 'Test';
    component.registerData.lastName = 'User';
    component.registerData.email = 'test@sbm.co.ke';
    component.registerData.username = 'testuser';
    component.registerData.phone = '0700000000';
    component.registerData.password = 'password123';
    component.registerData.confirmPassword = 'mismatch123';
    component.registerData.acceptTerms = true;

    component.onRegisterSubmit();

    expect(component.errorMessage).toBe('Passwords do not match. Please check and try again.');
  });

  it('should calculate real-time password strength correctly', () => {
    component.registerData.password = '123';
    expect(component.getPasswordStrength().label).toBe('Weak');

    component.registerData.password = 'Password123';
    expect(component.getPasswordStrength().label).toBe('Medium');

    component.registerData.password = 'P@ssw0rd123!';
    expect(component.getPasswordStrength().label).toBe('Strong');
  });
});
