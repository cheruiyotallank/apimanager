import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should execute GET requests with headers', () => {
    const mockData = { status: 'success' };

    service.get<{ status: string }>('/test').subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(req => req.url.includes('/test'));
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should execute POST requests with body', () => {
    const mockPayload = { name: 'SBM Bank' };
    const mockResponse = { id: '123', success: true };

    service.post<{ id: string; success: boolean }>('/test', mockPayload).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req => req.url.includes('/test'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPayload);
    req.flush(mockResponse);
  });
});
