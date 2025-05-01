import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IRoleRepository } from '../repository/role.repository.interface';
import {
  Role,
  Permission,
  CreateRoleRequest,
  UpdateRoleRequest,
} from '../interfaces/role.interface';
import { RoleRepository } from '../repository/role.repository';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly roleRepository = inject<IRoleRepository>(RoleRepository);

  getRoles(): Observable<Role[]> {
    return this.roleRepository.getRoles().pipe(
      catchError((error) => {
        console.error('Error fetching roles:', error);
        return throwError(() => new Error('Failed to fetch roles'));
      })
    );
  }

  getRole(id: number): Observable<Role> {
    return this.roleRepository.getRole(id).pipe(
      catchError((error) => {
        console.error(`Error fetching role ${id}:`, error);
        return throwError(() => new Error('Failed to fetch role'));
      })
    );
  }

  createRole(role: CreateRoleRequest): Observable<Role> {
    return this.roleRepository.createRole(role).pipe(
      catchError((error) => {
        console.error('Error creating role:', error);
        return throwError(() => new Error('Failed to create role'));
      })
    );
  }

  updateRole(id: number, role: UpdateRoleRequest): Observable<Role> {
    return this.roleRepository.updateRole(id, role).pipe(
      catchError((error) => {
        console.error(`Error updating role ${id}:`, error);
        return throwError(() => new Error('Failed to update role'));
      })
    );
  }

  deleteRole(id: number): Observable<void> {
    return this.roleRepository.deleteRole(id).pipe(
      catchError((error) => {
        console.error(`Error deleting role ${id}:`, error);
        return throwError(() => new Error('Failed to delete role'));
      })
    );
  }

  getPermissions(): Observable<Permission[]> {
    return this.roleRepository.getPermissions().pipe(
      catchError((error) => {
        console.error('Error fetching permissions:', error);
        return throwError(() => new Error('Failed to fetch permissions'));
      })
    );
  }

  checkRoleNameExists(name: string): Observable<boolean> {
    return this.roleRepository.checkRoleNameExists(name).pipe(
      catchError((error) => {
        console.error('Error checking role name:', error);
        return throwError(() => new Error('Failed to check role name'));
      })
    );
  }
}
