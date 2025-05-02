import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IAuthRepository } from './auth.repository.interface';
import {
  AuthError,
  LoginRequest,
  LoginResponse,
  UserPermissions,
} from '../interfaces/auth.interface';
import { JwtPayload } from '../interfaces/jwt.interface';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthRepository implements IAuthRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private _userPermissions = signal<UserPermissions | null>(null);

  get userPermissions(): WritableSignal<UserPermissions | null> {
    return this._userPermissions;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        map((response) => {
          if (!response.accessToken) {
            throw new Error('Invalid response format');
          }
          return response;
        }),
        catchError((error) => {
          const authError: AuthError = {
            message:
              error.error ||
              error.error?.message ||
              'An error occurred during login',
            status: error.status || 500,
          };
          return throwError(() => authError);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserPermissions(): UserPermissions | null {
    return this._userPermissions();
  }

  me(): Observable<UserPermissions> {
    const payload = this.decodeToken();
    if (!payload) {
      return throwError(() => new Error('Not authenticated'));
    }
    return this.http
      .get<UserPermissions>(`${this.baseUrl}/me/${payload.sub}`)
      .pipe(
        map((user) => {
          this._userPermissions.set(user);
          return user;
        })
      );
  }

  private decodeToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
