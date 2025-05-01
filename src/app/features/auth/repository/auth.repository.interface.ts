import { Observable } from 'rxjs';
import {
  LoginRequest,
  LoginResponse,
  UserPermissions,
} from '../interfaces/auth.interface';

export interface IAuthRepository {
  login(credentials: LoginRequest): Observable<LoginResponse>;
  logout(): void;
  getToken(): string | null;
  isAuthenticated(): boolean;
  me(): Observable<UserPermissions>;
  getUserPermissions(): UserPermissions | null;
}
