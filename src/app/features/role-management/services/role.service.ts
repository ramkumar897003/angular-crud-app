import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IRoleRepository } from '../repository/role.repository.interface';
import {
  Role,
  Permission,
  CreateRoleRequest,
  UpdateRoleRequest,
} from '../interfaces/role.interface';
import { RoleRepository } from '../repository/role.repository';
import { handleError } from '../../../shared/utils';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly roleRepository = inject<IRoleRepository>(RoleRepository);

  getRoles(): Observable<Role[]> {
    return this.roleRepository
      .getRoles()
      .pipe(catchError(handleError('Failed to fetch roles')));
  }

  getRole(id: number): Observable<Role> {
    return this.roleRepository
      .getRole(id)
      .pipe(catchError(handleError('Failed to fetch role')));
  }

  createRole(role: CreateRoleRequest): Observable<Role> {
    return this.roleRepository
      .createRole(role)
      .pipe(catchError(handleError('Failed to create role')));
  }

  updateRole(id: number, role: UpdateRoleRequest): Observable<Role> {
    return this.roleRepository
      .updateRole(id, role)
      .pipe(catchError(handleError('Failed to update role')));
  }

  deleteRole(id: number): Observable<void> {
    return this.roleRepository
      .deleteRole(id)
      .pipe(catchError(handleError('Failed to delete role')));
  }

  getPermissions(): Observable<Permission[]> {
    return this.roleRepository
      .getPermissions()
      .pipe(catchError(handleError('Failed to fetch permissions')));
  }

  checkRoleNameExists(name: string): Observable<boolean> {
    return this.roleRepository
      .checkRoleNameExists(name)
      .pipe(catchError(handleError('Failed to check role name')));
  }
}
