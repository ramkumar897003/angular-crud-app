import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { UserRepository } from '../repository/user.repository';
import { provideHttpClient } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserRepository, provideHttpClient()],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
