import { Injectable, Signal, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../repository/auth.repository';
import { IAuthRepository } from '../repository/auth.repository.interface';
import {
  LoginRequest,
  LoginResponse,
  UserPermissions,
} from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authRepository = inject<IAuthRepository>(AuthRepository);

  userPermissions: Signal<UserPermissions | null> =
    this.authRepository.userPermissions;

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.authRepository.login(credentials);
  }

  logout(): void {
    this.authRepository.logout();
  }

  isAuthenticated(): boolean {
    return this.authRepository.isAuthenticated();
  }

  getUserPermissions(): UserPermissions | null {
    return this.authRepository.getUserPermissions();
  }

  me(): Observable<UserPermissions> {
    return this.authRepository.me();
  }
}
