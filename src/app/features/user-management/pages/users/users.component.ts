import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User, UserPermissions } from '../../../auth/interfaces/auth.interface';
import { Role } from '../../../role-management/interfaces/role.interface';
import { CommonModule } from '@angular/common';
import { UserRepository } from '../../repository/user.repository';
import { AuthService } from '../../../auth/services/auth.service';
import { DeleteUserModalComponent } from '../../components/delete-user-modal/delete-user-modal.component';
import { CreateUserModalComponent } from '../../components/create-user-modal/create-user-modal.component';
import { EditUserModalComponent } from '../../components/edit-user-modal/edit-user-modal.component';
import { RoleService } from '../../../role-management/services/role.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    DeleteUserModalComponent,
    CreateUserModalComponent,
    EditUserModalComponent,
  ],
  providers: [UserService, UserRepository],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  users = signal<User[]>([]);
  userCount = signal(0);
  roles = signal<Role[]>([]);
  isCreateModalOpen = signal(false);
  isEditModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  selectedUser = signal<User | null>(null);
  error = signal('');
  userPermissions = signal<UserPermissions | null>(null);

  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private readonly authService = inject(AuthService);

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    this.userPermissions.set(this.authService.getUserPermissions());
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.userCount.set(users.length);
      },
      error: (error) => this.error.set(error.message),
    });
  }

  loadRoles() {
    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) => this.roles.set(roles),
      error: (error: Error) => this.error.set(error.message),
    });
  }

  openCreateModal() {
    this.isCreateModalOpen.set(true);
  }

  openEditModal(user: User) {
    this.selectedUser.set(user);
    this.isEditModalOpen.set(true);
  }

  openDeleteModal(user: User) {
    this.selectedUser.set(user);
    this.isDeleteModalOpen.set(true);
  }

  closeModals() {
    this.isCreateModalOpen.set(false);
    this.isEditModalOpen.set(false);
    this.isDeleteModalOpen.set(false);
    this.selectedUser.set(null);
  }

  createUser(userData: {
    email: string;
    fullName: string;
    password: string;
    roleId: number;
  }) {
    const newUser: Partial<User> = {
      name: userData.fullName,
      roleId: userData.roleId,
      email: userData.email,
      password: userData.password,
    };

    this.userService.createUser(newUser as User).subscribe({
      next: () => {
        this.loadUsers();
        this.closeModals();
      },
      error: (error) => this.error.set(error.message),
    });
  }

  updateUser(userData: {
    id: number;
    fullName: string;
    password?: string;
    roleId: number;
  }) {
    const updatedUser: Partial<User> = {
      id: userData.id,
      name: userData.fullName,
      roleId: userData.roleId,
      password: userData.password,
    };

    this.userService.updateUser(updatedUser as User).subscribe({
      next: () => {
        this.loadUsers();
        this.closeModals();
      },
      error: (error) => this.error.set(error.message),
    });
  }

  deleteUser() {
    const userId = this.selectedUser()?.id;
    if (!userId) return;

    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.loadUsers();
        this.closeModals();
      },
      error: (error) => this.error.set(error.message),
    });
  }
}
