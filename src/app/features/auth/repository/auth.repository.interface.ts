import { Observable } from 'rxjs';
import {
  LoginRequest,
  LoginResponse,
  UserPermissions,
} from '../interfaces/auth.interface';
import { Signal } from '@angular/core';

export interface IAuthRepository {
  userPermissions: Signal<UserPermissions | null>;
  login(credentials: LoginRequest): Observable<LoginResponse>;
  logout(): void;
  getToken(): string | null;
  isAuthenticated(): boolean;
  me(): Observable<UserPermissions>;
  getUserPermissions(): UserPermissions | null;
}
