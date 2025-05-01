import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { of } from 'rxjs';

export const permissionsGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const permissions = authService.getUserPermissions();
  if (!permissions) {
    router.navigate(['/auth/login']);
    return of(false);
  }

  const path = route.url[0]?.path;
  let requiredPermission = '';

  switch (path) {
    case 'roles':
      requiredPermission = 'View Role';
      break;
    case 'users':
      requiredPermission = 'View User';
      break;
    default:
      requiredPermission = 'View User';
  }

  const hasPermission = permissions.permissions.includes(requiredPermission);

  if (!hasPermission) {
    router.navigate(['/']);
    return of(false);
  }
  return of(true);
};
