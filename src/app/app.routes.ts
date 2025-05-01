import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth/auth.guard';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { permissionsGuard } from './core/guards/permissions/permissions.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(
        (m) => m.dashboardRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'roles',
    loadChildren: () =>
      import('./features/role-management/role-management.routes').then(
        (m) => m.roleManagementRoutes
      ),
    canActivate: [permissionsGuard, authGuard],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
