import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { Permission, Role } from '../../interfaces/role.interface';
import { CreateRoleModalComponent } from '../../components/create-role-modal/create-role-modal.component';
import { EditRoleModalComponent } from '../../components/edit-role-modal/edit-role-modal.component';
import { DeleteRoleModalComponent } from '../../components/delete-role-modal/delete-role-modal.component';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CreateRoleModalComponent,
    EditRoleModalComponent,
    DeleteRoleModalComponent,
  ],
  templateUrl: './roles.component.html',
})
export class RoleManagementComponent {
  private readonly roleService = inject(RoleService);
  private readonly authService = inject(AuthService);

  roles = signal<Role[]>([]);
  permissions = signal<Permission[]>([]);
  selectedRole = signal<Role | null>(null);
  isCreateModalOpen = signal(false);
  isEditModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  error = signal('');
  roleName = signal('');
  currentUserRoleId = signal<number>(0);
  selectedPermissions = signal<number[]>([]);

  ngOnInit() {
    this.loadRoles();
    this.loadPermissions();
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    const roleId = this.authService.getUserPermissions()?.roleId;

    if (roleId) {
      this.currentUserRoleId.set(roleId);
    }
  }

  loadRoles() {
    this.roleService.getRoles().subscribe({
      next: (roles) => this.roles.set(roles),
      error: (error) => this.error.set(error.message),
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
          this.loadRoles();
          this.closeModals();
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
}
