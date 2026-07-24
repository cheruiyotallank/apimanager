import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * ============================================================================
 * CORE BASE HTTP API SERVICE (core/services/api.service.ts)
 * ============================================================================
 * Centralized Angular HTTP client wrapper for handling REST API requests,
 * request headers, environment base URLs, and HTTP error handling.
 * ============================================================================
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Generates default HTTP headers including optional JWT Authorization token.
   */
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const token = localStorage.getItem('sbm_auth_token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Generic GET request handler
   */
  public get<T>(path: string, params?: HttpParams): Observable<T> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : '/' + path}`;
    return this.http.get<T>(url, { headers: this.getHeaders(), params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Generic POST request handler
   */
  public post<T>(path: string, body: any): Observable<T> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : '/' + path}`;
    return this.http.post<T>(url, body, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Generic PUT request handler
   */
  public put<T>(path: string, body: any): Observable<T> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : '/' + path}`;
    return this.http.put<T>(url, body, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Generic DELETE request handler
   */
  public delete<T>(path: string): Observable<T> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : '/' + path}`;
    return this.http.delete<T>(url, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Centralized HTTP Error Handler
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected server error occurred. Please try again later.';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network Error: ${error.error.message}`;
    } else if (error.error && error.error.message) {
      // Server returned JSON error message
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to SBM Bank API server. Please check your internet connection.';
    } else if (error.status === 401) {
      errorMessage = 'Session expired or unauthorized. Please log in again.';
    } else if (error.status === 403) {
      errorMessage = 'Access forbidden. You do not have permissions for this resource.';
    } else if (error.status === 404) {
      errorMessage = 'Requested API endpoint was not found.';
    }

    return throwError(() => new Error(errorMessage));
  }
}
