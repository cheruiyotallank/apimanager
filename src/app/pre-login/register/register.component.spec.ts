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

  it('should show error if terms are not accepted', () => {
    component.registerData.firstName = 'Test';
    component.registerData.lastName = 'User';
    component.registerData.email = 'test@sbm.co.ke';
    component.registerData.username = 'testuser';
    component.registerData.organizationName = 'SBM Tech';
    component.registerData.phone = '0700000000';
    component.registerData.acceptTerms = false;

    component.onRegisterSubmit();

    expect(component.errorMessage).toBe("You must accept SBM Bank's Terms and Conditions concerning this application.");
  });

  it('should transition to EMAIL_VERIFICATION step on valid registration submit', () => {
    component.registerData.firstName = 'Allan';
    component.registerData.lastName = 'Smith';
    component.registerData.email = 'allan@sbm.co.ke';
    component.registerData.username = 'allansmith';
    component.registerData.organizationName = 'SBM Bank Ltd';
    component.registerData.phone = '+254700000000';
    component.registerData.acceptTerms = true;

    component.onRegisterSubmit();

    expect(component.isSubmitting).toBe(true);
  });
});
