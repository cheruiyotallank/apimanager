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
});
