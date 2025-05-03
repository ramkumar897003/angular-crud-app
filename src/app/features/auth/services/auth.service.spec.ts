import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import { AuthRepository } from '../repository/auth.repository';
import { of, throwError } from 'rxjs';
import {
  LoginRequest,
  LoginResponse,
  UserPermissions,
} from '../interfaces/auth.interface';
import { signal, WritableSignal } from '@angular/core';

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: jasmine.SpyObj<AuthRepository>;
  let userPermissionsSignal: WritableSignal<UserPermissions | null>;

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

  const mockUserPermissions: UserPermissions = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    roleId: 1,
    permissions: ['read', 'write'],
  };

  beforeEach(() => {
    userPermissionsSignal = signal<UserPermissions | null>(null);

    authRepository = jasmine.createSpyObj('AuthRepository', [
      'login',
      'logout',
      'isAuthenticated',
      'getUserPermissions',
      'me',
    ]);

    Object.defineProperty(authRepository, 'userPermissions', {
      get: () => userPermissionsSignal,
    });

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        { provide: AuthRepository, useValue: authRepository },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should call authRepository.login with correct credentials', () => {
      authRepository.login.and.returnValue(of(mockLoginResponse));

      service.login(mockLoginRequest).subscribe();

      expect(authRepository.login).toHaveBeenCalledWith(mockLoginRequest);
    });

    it('should return the login response from repository', (done) => {
      authRepository.login.and.returnValue(of(mockLoginResponse));

      service.login(mockLoginRequest).subscribe({
        next: (response) => {
          expect(response).toEqual(mockLoginResponse);
          done();
        },
        error: done.fail,
      });
    });

    it('should handle login error', (done) => {
      const error = new Error('Login failed');
      authRepository.login.and.returnValue(throwError(() => error));

      service.login(mockLoginRequest).subscribe({
        next: () => done.fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          done();
        },
      });
    });
  });

  describe('logout', () => {
    it('should call authRepository.logout', () => {
      service.logout();
      expect(authRepository.logout).toHaveBeenCalled();
    });

    it('should clear authentication state', () => {
      // Setup initial authenticated state
      authRepository.isAuthenticated.and.returnValue(true);
      authRepository.getUserPermissions.and.returnValue(mockUserPermissions);

      // Verify initial state
      expect(service.isAuthenticated()).toBe(true);
      expect(service.getUserPermissions()).toEqual(mockUserPermissions);

      // Perform logout
      service.logout();

      // Verify repository methods were called
      expect(authRepository.logout).toHaveBeenCalled();
    });

    it('should be called after successful login and logout sequence', () => {
      // Setup login response
      authRepository.login.and.returnValue(of(mockLoginResponse));

      // Perform login
      service.login(mockLoginRequest).subscribe();

      // Verify login was successful
      expect(authRepository.login).toHaveBeenCalledWith(mockLoginRequest);

      // Perform logout
      service.logout();

      // Verify logout was called
      expect(authRepository.logout).toHaveBeenCalled();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', () => {
      authRepository.isAuthenticated.and.returnValue(true);
      expect(service.isAuthenticated()).toBe(true);
      expect(authRepository.isAuthenticated).toHaveBeenCalled();
    });

    it('should return false when user is not authenticated', () => {
      authRepository.isAuthenticated.and.returnValue(false);
      expect(service.isAuthenticated()).toBe(false);
      expect(authRepository.isAuthenticated).toHaveBeenCalled();
    });

    it('should reflect authentication state after login and logout', () => {
      // Initial state - not authenticated
      authRepository.isAuthenticated.and.returnValue(false);
      expect(service.isAuthenticated()).toBe(false);

      // After successful login
      authRepository.login.and.returnValue(of(mockLoginResponse));
      authRepository.isAuthenticated.and.returnValue(true);

      service.login(mockLoginRequest).subscribe();
      expect(service.isAuthenticated()).toBe(true);

      // After logout
      authRepository.isAuthenticated.and.returnValue(false);
      service.logout();
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('getUserPermissions', () => {
    it('should return user permissions when they exist', () => {
      authRepository.getUserPermissions.and.returnValue(mockUserPermissions);
      expect(service.getUserPermissions()).toEqual(mockUserPermissions);
      expect(authRepository.getUserPermissions).toHaveBeenCalled();
    });

    it('should return null when no permissions exist', () => {
      authRepository.getUserPermissions.and.returnValue(null);
      expect(service.getUserPermissions()).toBeNull();
      expect(authRepository.getUserPermissions).toHaveBeenCalled();
    });

    it('should reflect permissions state after login and logout', () => {
      // Initial state - no permissions
      authRepository.getUserPermissions.and.returnValue(null);
      expect(service.getUserPermissions()).toBeNull();

      // After successful login
      authRepository.login.and.returnValue(of(mockLoginResponse));
      authRepository.getUserPermissions.and.returnValue(mockUserPermissions);

      service.login(mockLoginRequest).subscribe();
      expect(service.getUserPermissions()).toEqual(mockUserPermissions);

      // After logout
      authRepository.getUserPermissions.and.returnValue(null);
      service.logout();
      expect(service.getUserPermissions()).toBeNull();
    });

    it('should return correct permissions structure', () => {
      authRepository.getUserPermissions.and.returnValue(mockUserPermissions);
      const permissions = service.getUserPermissions();

      expect(permissions).toBeTruthy();
      expect(permissions?.id).toBe(mockUserPermissions.id);
      expect(permissions?.email).toBe(mockUserPermissions.email);
      expect(permissions?.name).toBe(mockUserPermissions.name);
      expect(permissions?.roleId).toBe(mockUserPermissions.roleId);
      expect(permissions?.permissions).toEqual(mockUserPermissions.permissions);
    });
  });

  describe('me', () => {
    it('should return user permissions from repository', (done) => {
      authRepository.me.and.returnValue(of(mockUserPermissions));

      service.me().subscribe({
        next: (permissions) => {
          expect(permissions).toEqual(mockUserPermissions);
          expect(authRepository.me).toHaveBeenCalled();
          done();
        },
        error: done.fail,
      });
    });

    it('should handle error when not authenticated', (done) => {
      const error = new Error('Not authenticated');
      authRepository.me.and.returnValue(throwError(() => error));

      service.me().subscribe({
        next: () => done.fail('Should have failed'),
        error: (err) => {
          expect(err).toBe(error);
          expect(authRepository.me).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should update userPermissions signal on successful me() call', (done) => {
      authRepository.me.and.returnValue(of(mockUserPermissions));

      // Mock the repository to update the signal when me() is called
      authRepository.me.and.callFake(() => {
        userPermissionsSignal.set(mockUserPermissions);
        return of(mockUserPermissions);
      });

      service.me().subscribe({
        next: () => {
          expect(userPermissionsSignal()).toEqual(mockUserPermissions);
          done();
        },
        error: done.fail,
      });
    });

    it('should maintain consistent state between me() and getUserPermissions()', (done) => {
      // Mock the repository to update the signal when me() is called
      authRepository.me.and.callFake(() => {
        userPermissionsSignal.set(mockUserPermissions);
        return of(mockUserPermissions);
      });
      authRepository.getUserPermissions.and.returnValue(mockUserPermissions);

      service.me().subscribe({
        next: () => {
          expect(service.getUserPermissions()).toEqual(mockUserPermissions);
          expect(userPermissionsSignal()).toEqual(mockUserPermissions);
          done();
        },
        error: done.fail,
      });
    });
  });
});
