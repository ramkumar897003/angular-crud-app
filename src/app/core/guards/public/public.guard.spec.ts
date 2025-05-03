import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { publicGuard } from './public.guard';

describe('publicGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => publicGuard(...guardParameters));

  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
          },
        },
      ],
    });

    router = TestBed.inject(Router);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true when token does not exist', () => {
    expect(executeGuard({} as any, {} as any)).toBeTrue();
  });

  it('should return false and navigate to home when token exists', () => {
    localStorage.setItem('token', 'test-token');
    expect(executeGuard({} as any, {} as any)).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
