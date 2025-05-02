import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { MenuService } from '../../services/menu/menu.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly menuService = inject(MenuService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  toggleMobileMenu() {
    this.menuService.toggleMenu();
  }
}
