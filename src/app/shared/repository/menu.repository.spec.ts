import { TestBed } from '@angular/core/testing';
import { MenuRepository } from './menu.repository';

describe('MenuRepository', () => {
  let repository: MenuRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuRepository],
    });

    repository = TestBed.inject(MenuRepository);
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  it('should initialize isMobileMenuOpen signal as false', () => {
    expect(repository.isMobileMenuOpen()).toBeFalse();
  });

  it('should toggle isMobileMenuOpen signal when toggleMenu is called', () => {
    expect(repository.isMobileMenuOpen()).toBeFalse();

    repository.toggleMenu();
    expect(repository.isMobileMenuOpen()).toBeTrue();

    repository.toggleMenu();
    expect(repository.isMobileMenuOpen()).toBeFalse();
  });

  it('should expose isMobileMenuOpen as a writable signal', () => {
    const signal = repository.isMobileMenuOpen;
    expect(signal).toBeTruthy();

    signal.set(true);
    expect(repository.isMobileMenuOpen()).toBeTrue();

    signal.set(false);
    expect(repository.isMobileMenuOpen()).toBeFalse();
  });
});
