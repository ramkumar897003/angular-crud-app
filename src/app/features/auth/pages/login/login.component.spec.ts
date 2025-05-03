import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import {
  LoginResponse,
  UserPermissions,
} from '../../interfaces/auth.interface';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const mockUserPermissions: UserPermissions = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    roleId: 1,
    permissions: ['read', 'write'],
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
    authService = jasmine.createSpyObj('AuthService', ['login', 'me']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should call authService.login with correct credentials', () => {
      authService.login.and.returnValue(of(mockLoginResponse));
      authService.me.and.returnValue(of(mockUserPermissions));

      component.email.set('test@example.com');
      component.password.set('password123');
      component.onSubmit();

      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should store token and navigate to home on successful login', () => {
      authService.login.and.returnValue(of(mockLoginResponse));
      authService.me.and.returnValue(of(mockUserPermissions));

      component.onSubmit();

      expect(localStorage.getItem('token')).toBe('mock-token');
      expect(authService.me).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should set error message on login failure', () => {
      const errorMessage = 'Invalid credentials';
      authService.login.and.returnValue(
        throwError(() => ({ message: errorMessage }))
      );

      component.onSubmit();

      expect(component.error()).toBe(errorMessage);
    });

    it('should set default error message when no message provided', () => {
      authService.login.and.returnValue(throwError(() => ({})));

      component.onSubmit();

      expect(component.error()).toBe('An error occurred during login');
    });

    it('should clear error message before attempting login', () => {
      component.error.set('Previous error');
      authService.login.and.returnValue(of(mockLoginResponse));
      authService.me.and.returnValue(of(mockUserPermissions));

      component.onSubmit();

      expect(component.error()).toBe('');
    });

    it('should handle me() call error', () => {
      authService.login.and.returnValue(of(mockLoginResponse));
      authService.me.and.returnValue(
        throwError(() => ({ message: 'Failed to get user data' }))
      );

      component.onSubmit();

      expect(localStorage.getItem('token')).toBe('mock-token');
      expect(authService.me).toHaveBeenCalled();
      expect(component.error()).toBe('Failed to get user data');
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
