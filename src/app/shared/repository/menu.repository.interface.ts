import { Signal } from '@angular/core';

export interface IMenuRepository {
  isMobileMenuOpen: Signal<boolean>;
  toggleMenu(): void;
}
