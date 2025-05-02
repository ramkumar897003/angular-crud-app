import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { of } from 'rxjs';
import { RolePermissions } from '../../../shared/enums';

export const permissionsGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const userPermissions = authService.getUserPermissions();
  if (!userPermissions) {
    router.navigate(['/auth/login']);
    return of(false);
  }

  const path = route.url[0]?.path;
  let requiredPermission = '';

  switch (path) {
    case 'roles':
      requiredPermission = RolePermissions.VIEW_ROLE;
      break;
    case 'users':
      requiredPermission = RolePermissions.VIEW_USER;
      break;
    default:
      requiredPermission = RolePermissions.VIEW_USER;
  }

  const hasPermission =
    userPermissions.permissions.includes(requiredPermission);

  if (!hasPermission) {
    router.navigate(['/']);
    return of(false);
  }
  return of(true);
};
