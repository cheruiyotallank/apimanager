import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApiResponse, AuthResponse } from '../models/auth.models';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login endpoint and save session on success', () => {
    const mockAuthResponse: AuthResponse = {
      accessToken: 'jwt_mock_token_123',
      user: {
        id: '1',
        firstName: 'Allan',
        lastName: 'Smith',
        email: 'allan@sbm.co.ke',
        phone: '+254700000000',
        organizationName: 'SBM Bank',
        organizationType: 'Enterprise',
        country: 'Kenya (+254)',
        roles: ['DEVELOPER']
      }
    };

    const mockResponse: ApiResponse<AuthResponse> = {
      success: true,
      message: 'Login successful',
      data: mockAuthResponse
    };

    service.login({ email: 'allan@sbm.co.ke', password: 'Password123!' }).subscribe(res => {
      expect(res.success).toBe(true);
      expect(service.getToken()).toBe('jwt_mock_token_123');
    });

    const req = httpMock.expectOne(req => req.url.includes('/auth/login'));
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should manage login and logout session state correctly', () => {
    const mockUser = {
      id: '1',
      firstName: 'Allan',
      lastName: 'Smith',
      email: 'allan@sbm.co.ke',
      phone: '+254700000000',
      organizationName: 'SBM Bank',
      organizationType: 'Enterprise',
      country: 'Kenya (+254)',
      roles: ['DEVELOPER']
    };

    service.saveSession({ accessToken: 'test_token', user: mockUser });
    expect(service.isLoggedIn()).toBe(true);
    expect(service.getToken()).toBe('test_token');

    service.logout();
    expect(service.isLoggedIn()).toBe(false);
    expect(service.getToken()).toBeNull();
  });
});
