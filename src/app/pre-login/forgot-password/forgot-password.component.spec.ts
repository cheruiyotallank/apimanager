import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { provideRouter } from '@angular/router';

/**
 * Unit Test Spec for ForgotPasswordComponent
 */
describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the forgot password component successfully', () => {
    expect(component).toBeTruthy();
  });

  it('should show error message if submitted with empty email', () => {
    component.email = '';
    component.onResetSubmit();
    expect(component.errorMessage).toBe('Please enter your Email Address.');
  });

  it('should show error message if email format is invalid', () => {
    component.email = 'invalid-email';
    component.onResetSubmit();
    expect(component.errorMessage).toBe('Please enter a valid Email Address (e.g. user@sbm.co.ke).');
  });

  it('should trigger reset submission for valid email', () => {
    component.email = 'user@sbm.co.ke';
    component.onResetSubmit();
    expect(component.isSubmitting).toBe(true);
  });
});
