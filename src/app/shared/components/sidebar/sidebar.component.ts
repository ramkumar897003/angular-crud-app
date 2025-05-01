import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../features/auth/services/auth.service';
import { UserPermissions } from '../../../features/auth/interfaces/auth.interface';

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

  private authService = inject(AuthService);
  userPermissions = signal<UserPermissions | null>(null);

  constructor() {
    this.userPermissions.set(this.authService.getUserPermissions());
  }
}
