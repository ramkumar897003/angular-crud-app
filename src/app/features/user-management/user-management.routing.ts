import { Routes } from '@angular/router';
import { UsersComponent } from './pages/users/users.component';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
export const userManagementRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: UsersComponent,
      },
    ],
  },
];
