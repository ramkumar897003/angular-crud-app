import { TestBed } from '@angular/core/testing';
import { MenuService } from './menu.service';
import { MenuRepository } from '../../repository/menu.repository';
import { signal } from '@angular/core';

describe('MenuService', () => {
  let service: MenuService;
  let menuRepository: jasmine.SpyObj<MenuRepository>;

  beforeEach(() => {
    const menuRepositorySpy = jasmine.createSpyObj(
      'MenuRepository',
      ['toggleMenu'],
      {
        isMobileMenuOpen: signal(false),
      }
    );

    TestBed.configureTestingModule({
      providers: [
        MenuService,
        { provide: MenuRepository, useValue: menuRepositorySpy },
      ],
    });

    service = TestBed.inject(MenuService);
    menuRepository = TestBed.inject(
      MenuRepository
    ) as jasmine.SpyObj<MenuRepository>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose isMobileMenuOpen signal from repository', () => {
    expect(service.isMobileMenuOpen).toBe(menuRepository.isMobileMenuOpen);
  });

  it('should call repository toggleMenu method when toggleMenu is called', () => {
    service.toggleMenu();
    expect(menuRepository.toggleMenu).toHaveBeenCalled();
  });
});
