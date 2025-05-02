import { inject, Injectable, Signal } from '@angular/core';
import { MenuRepository } from '../../repository/menu.repository';
import { IMenuRepository } from '../../repository/menu.repository.interface';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly menuRepository = inject<IMenuRepository>(MenuRepository);

  isMobileMenuOpen: Signal<boolean> = this.menuRepository.isMobileMenuOpen;

  toggleMenu() {
    this.menuRepository.toggleMenu();
  }
}
