import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { Permission, Role } from '../../interfaces/role.interface';
import { CreateRoleModalComponent } from '../../components/create-role-modal/create-role-modal.component';
import { EditRoleModalComponent } from '../../components/edit-role-modal/edit-role-modal.component';
import { DeleteRoleModalComponent } from '../../components/delete-role-modal/delete-role-modal.component';

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

  roles = signal<Role[]>([]);
  permissions = signal<Permission[]>([]);
  selectedRole = signal<Role | null>(null);
  isCreateModalOpen = signal(false);
  isEditModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  error = signal('');
  roleName = '';
  selectedPermissions: number[] = [];

  ngOnInit() {
    this.loadRoles();
    this.loadPermissions();
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
    this.roleName = '';
    this.selectedPermissions = [];
    this.isCreateModalOpen.set(true);
  }

  openEditModal(role: Role) {
    this.selectedRole.set(role);
    this.selectedPermissions = role.permissions.map((p) => p);
    console.log(this.selectedPermissions);
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
    this.roleName = '';
    this.selectedPermissions = [];
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

  onPermissionChange(event: Event, permissionId: number): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedPermissions.push(permissionId);
    } else {
      const index = this.selectedPermissions.indexOf(permissionId);
      if (index > -1) {
        this.selectedPermissions.splice(index, 1);
      }
    }
  }
}
