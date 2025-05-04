import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { Permission, Role } from '../../interfaces/role.interface';
import { CreateRoleModalComponent } from '../../components/create-role-modal/create-role-modal.component';
import { EditRoleModalComponent } from '../../components/edit-role-modal/edit-role-modal.component';
import { DeleteRoleModalComponent } from '../../components/delete-role-modal/delete-role-modal.component';
import { AuthService } from '../../../auth/services/auth.service';
import { RolePermissions } from '../../../../shared/enums';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CreateRoleModalComponent,
    EditRoleModalComponent,
    DeleteRoleModalComponent,
    LoaderComponent,
  ],
  templateUrl: './roles.component.html',
})
export class RolesComponent {
  private readonly roleService = inject(RoleService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  roles = signal<Role[]>([]);
  rolesCount = signal(0);
  permissions = signal<Permission[]>([]);
  selectedRole = signal<Role | null>(null);
  isCreateModalOpen = signal(false);
  isEditModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  error = signal('');
  roleName = signal('');
  selectedPermissions = signal<number[]>([]);
  rolePermissions = RolePermissions;
  currentUser = this.authService.userPermissions;
  isLoading = signal(false);

  ngOnInit() {
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles() {
    this.isLoading.set(true);
    this.error.set('');
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.roles.set(roles);
        this.rolesCount.set(roles.length);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set(error.message);
        this.isLoading.set(false);
      },
    });
  }

  loadPermissions() {
    this.roleService.getPermissions().subscribe({
      next: (permissions) => this.permissions.set(permissions),
      error: (error) => this.error.set(error.message),
    });
  }

  openCreateModal() {
    this.roleName.set('');
    this.selectedPermissions.set([]);
    this.isCreateModalOpen.set(true);
  }

  openEditModal(role: Role) {
    this.selectedRole.set(role);
    this.selectedPermissions.set(role.permissions.map((p) => p));
    this.isEditModalOpen.set(true);
  }

  openDeleteModal(role: Role) {
    this.selectedRole.set(role);
    this.isDeleteModalOpen.set(true);
  }

  closeModals() {
    this.isCreateModalOpen.set(false);
    this.isEditModalOpen.set(false);
    this.isDeleteModalOpen.set(false);
    this.selectedRole.set(null);
    this.roleName.set('');
    this.selectedPermissions.set([]);
  }

  createRole(role: { name: string; permissions: number[] }) {
    this.roleService.createRole(role).subscribe({
      next: () => {
        this.loadRoles();
        this.closeModals();
      },
      error: (error) => this.error.set(error.message),
    });
  }

  updateRole(data: { permissions: number[] }): void {
    if (!this.selectedRole()) return;

    this.roleService
      .updateRole(this.selectedRole()!.id, {
        name: this.selectedRole()!.name,
        permissions: data.permissions,
      })
      .subscribe({
        next: () => {
          this.checkIfCurrentRoutePermitted().subscribe((isAllowed) => {
            if (!isAllowed) {
              this.router.navigateByUrl('/');
            } else {
              this.loadRoles();
              this.closeModals();
            }
          });
        },
        error: (error) => {
          console.error('Error updating role:', error);
          this.closeModals();
        },
      });
  }

  deleteRole() {
    if (!this.selectedRole()) return;

    this.roleService.deleteRole(this.selectedRole()!.id).subscribe({
      next: () => {
        this.loadRoles();
        this.closeModals();
      },
      error: (error) => this.error.set(error.message),
    });
  }

  checkIfCurrentRoutePermitted(): Observable<boolean> {
    return this.authService
      .me()
      .pipe(
        map((user) => user.permissions.includes(RolePermissions.VIEW_ROLE))
      );
  }
}
