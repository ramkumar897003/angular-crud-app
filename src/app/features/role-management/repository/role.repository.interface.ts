import { Observable } from 'rxjs';
import {
  CreateRoleRequest,
  Permission,
  Role,
  UpdateRoleRequest,
} from '../interfaces/role.interface';

export interface IRoleRepository {
  getRoles(): Observable<Role[]>;
  getRole(id: number): Observable<Role>;
  createRole(role: CreateRoleRequest): Observable<Role>;
  updateRole(id: number, role: UpdateRoleRequest): Observable<Role>;
  deleteRole(id: number): Observable<void>;
  getPermissions(): Observable<Permission[]>;
  checkRoleNameExists(name: string): Observable<boolean>;
}
