import { TestBed } from '@angular/core/testing';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { RolePermissions } from '../../../shared/enums';
import { permissionsGuard } from './permissions.guard';
import { UserPermissions } from '../../../features/auth/interfaces/auth.interface';
import { Observable, firstValueFrom } from 'rxjs';

describe('permissionsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => permissionsGuard(...guardParameters));

  let router: Router;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getUserPermissions',
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should redirect to login when user has no permissions', async () => {
    authService.getUserPermissions.and.returnValue(null);

    const result = executeGuard(
      { url: [{ path: 'users' }] } as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    if (result instanceof Observable) {
      const value = await firstValueFrom(result);
      expect(value).toBeFalse();
    } else {
      expect(result).toBeFalse();
    }
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should allow access to users page when user has VIEW_USER permission', async () => {
    const mockUserPermissions: UserPermissions = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      roleId: 1,
      permissions: [RolePermissions.VIEW_USER],
    };
    authService.getUserPermissions.and.returnValue(mockUserPermissions);

    const result = executeGuard(
      { url: [{ path: 'users' }] } as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    if (result instanceof Observable) {
      const value = await firstValueFrom(result);
      expect(value).toBeTrue();
    } else {
      expect(result).toBeTrue();
    }
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should allow access to roles page when user has VIEW_ROLE permission', async () => {
    const mockUserPermissions: UserPermissions = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      roleId: 1,
      permissions: [RolePermissions.VIEW_ROLE],
    };
    authService.getUserPermissions.and.returnValue(mockUserPermissions);

    const result = executeGuard(
      { url: [{ path: 'roles' }] } as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    if (result instanceof Observable) {
      const value = await firstValueFrom(result);
      expect(value).toBeTrue();
    } else {
      expect(result).toBeTrue();
    }
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to home when user lacks required permission', async () => {
    const mockUserPermissions: UserPermissions = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      roleId: 1,
      permissions: ['SOME_OTHER_PERMISSION'],
    };
    authService.getUserPermissions.and.returnValue(mockUserPermissions);

    const result = executeGuard(
      { url: [{ path: 'users' }] } as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    if (result instanceof Observable) {
      const value = await firstValueFrom(result);
      expect(value).toBeFalse();
    } else {
      expect(result).toBeFalse();
    }
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should default to VIEW_USER permission for unknown paths', async () => {
    const mockUserPermissions: UserPermissions = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      roleId: 1,
      permissions: [RolePermissions.VIEW_USER],
    };
    authService.getUserPermissions.and.returnValue(mockUserPermissions);

    const result = executeGuard(
      { url: [{ path: 'unknown' }] } as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    if (result instanceof Observable) {
      const value = await firstValueFrom(result);
      expect(value).toBeTrue();
    } else {
      expect(result).toBeTrue();
    }
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
