import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { publicGuard } from '../../core/guards/public/public.guard';
export const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [publicGuard],
  },
];
