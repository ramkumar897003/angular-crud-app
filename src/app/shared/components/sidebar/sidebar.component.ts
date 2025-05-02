import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../features/auth/services/auth.service';
import { MenuService } from '../../services/menu/menu.service';
interface MenuItem {
  path: string;
  label: string;
  permission?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    {
      path: '/',
      label: 'Dashboard',
    },
    {
      path: '/roles',
      label: 'Role Management',
      permission: 'View Role',
    },
    {
      path: '/users',
      label: 'User Management',
      permission: 'View User',
    },
  ];

  private readonly authService = inject(AuthService);
  private readonly menuService = inject(MenuService);

  userPermissions = this.authService.userPermissions;
  isMobileMenuOpen = this.menuService.isMobileMenuOpen;

  toggleMobileMenu() {
    this.menuService.toggleMenu();
  }
}
