import { TestBed } from '@angular/core/testing';
import { AuthRepository } from './auth.repository';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { LoginRequest, LoginResponse } from '../interfaces/auth.interface';
import { provideHttpClient } from '@angular/common/http';

describe('AuthRepository', () => {
  let repository: AuthRepository;
  let httpMock: HttpTestingController;

  const mockLoginRequest: LoginRequest = {
    email: 'test@example.com',
    password: 'password123',
  };

  const mockLoginResponse: LoginResponse = {
    accessToken: 'mock-token',
    user: {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      roleId: 1,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        AuthRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    repository = TestBed.inject(AuthRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  describe('login', () => {
    it('should make POST request to login endpoint with credentials', () => {
      repository.login(mockLoginRequest).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockLoginRequest);
    });

    it('should return login response on successful login', (done) => {
      repository.login(mockLoginRequest).subscribe({
        next: (response) => {
          expect(response).toEqual(mockLoginResponse);
          done();
        },
        error: done.fail,
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/login`);
      req.flush(mockLoginResponse);
    });

    it('should throw error when response has no access token', (done) => {
      const invalidResponse = {
        user: mockLoginResponse.user,
      };

      repository.login(mockLoginRequest).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('An error occurred during login');
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/login`);
      req.flush(invalidResponse);
    });

    it('should handle 401 unauthorized error', (done) => {
      const errorResponse = {
        message: 'Invalid credentials',
        status: 401,
      };

      repository.login(mockLoginRequest).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
          expect(error.message.message).toBe(errorResponse.message);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/login`);
      req.flush(errorResponse, { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle 500 server error', (done) => {
      const errorResponse = {
        message: 'Internal server error',
        status: 500,
      };

      repository.login(mockLoginRequest).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.message.message).toBe(errorResponse.message);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/login`);
      req.flush(errorResponse, {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });

    it('should handle network error', (done) => {
      repository.login(mockLoginRequest).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/login`);
      req.error(new ProgressEvent('error'));
    });
  });
});
