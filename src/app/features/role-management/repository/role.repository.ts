import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CreateRoleRequest,
  Permission,
  Role,
  RoleError,
  UpdateRoleRequest,
} from '../interfaces/role.interface';
import { IRoleRepository } from './role.repository.interface';

@Injectable({
  providedIn: 'root',
})
export class RoleRepository implements IRoleRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}/roles`).pipe(
      catchError((error) => {
        console.error('Error fetching roles:', error);
        return throwError(() => error);
      })
    );
  }

  getRole(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.baseUrl}/roles/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching role ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.baseUrl}/permissions`).pipe(
      catchError((error) => {
        console.error('Error fetching permissions:', error);
        return throwError(() => error);
      })
    );
  }

  createRole(role: CreateRoleRequest): Observable<Role> {
    return this.http.post<Role>(`${this.baseUrl}/roles`, role).pipe(
      catchError((error) => {
        console.error('Error creating role:', error);
        return throwError(() => error);
      })
    );
  }

  updateRole(id: number, role: UpdateRoleRequest): Observable<Role> {
    return this.http.put<Role>(`${this.baseUrl}/roles/${id}`, role).pipe(
      catchError((error) => {
        console.error(`Error updating role ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/roles/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting role ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  checkRoleNameExists(name: string): Observable<boolean> {
    return this.http
      .get<Role[]>(`${this.baseUrl}/roles?name=${name}`)
      .pipe(map((roles) => roles.length > 0));
  }

  private handleError(error: any): Observable<never> {
    const roleError: RoleError = {
      message: error.error?.message || 'An error occurred',
      status: error.status || 500,
    };
    return throwError(() => roleError);
  }
}
