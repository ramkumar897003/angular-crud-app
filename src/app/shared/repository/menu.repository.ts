import { Injectable, signal, WritableSignal } from '@angular/core';
import { IMenuRepository } from './menu.repository.interface';

@Injectable({
  providedIn: 'root',
})
export class MenuRepository implements IMenuRepository {
  private _isMobileMenuOpen = signal<boolean>(false);

  get isMobileMenuOpen(): WritableSignal<boolean> {
    return this._isMobileMenuOpen;
  }

  toggleMenu() {
    this._isMobileMenuOpen.update((value) => !value);
  }
}
