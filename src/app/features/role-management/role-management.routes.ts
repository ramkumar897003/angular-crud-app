import { Routes } from '@angular/router';
import { RolesComponent } from './pages/roles/roles.component';
import { LayoutComponent } from '../../shared/components/layout/layout.component';

export const roleManagementRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: RolesComponent,
      },
    ],
  },
];
