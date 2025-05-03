import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RolesComponent } from './roles.component';
import { RoleService } from '../../services/role.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Role, Permission } from '../../interfaces/role.interface';
import { RolePermissions } from '../../../../shared/enums';
import { CreateRoleModalComponent } from '../../components/create-role-modal/create-role-modal.component';
import { EditRoleModalComponent } from '../../components/edit-role-modal/edit-role-modal.component';
import { DeleteRoleModalComponent } from '../../components/delete-role-modal/delete-role-modal.component';
import { signal } from '@angular/core';

describe('RolesComponent', () => {
  let component: RolesComponent;
  let fixture: ComponentFixture<RolesComponent>;
  let roleService: jasmine.SpyObj<RoleService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const mockRole: Role = {
    id: 1,
    name: 'Admin',
    permissions: [1, 2],
  };

  const mockPermission: Permission = {
    id: 1,
    name: 'View User',
  };

  beforeEach(async () => {
    const roleServiceSpy = jasmine.createSpyObj('RoleService', [
      'getRoles',
      'getPermissions',
      'createRole',
      'updateRole',
      'deleteRole',
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['me'], {
      userPermissions: signal({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        roleId: 1,
        permissions: [RolePermissions.VIEW_ROLE],
      }),
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [
        RolesComponent,
        CreateRoleModalComponent,
        EditRoleModalComponent,
        DeleteRoleModalComponent,
      ],
      providers: [
        { provide: RoleService, useValue: roleServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    roleService = TestBed.inject(RoleService) as jasmine.SpyObj<RoleService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(RolesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load roles and permissions on init', () => {
      roleService.getRoles.and.returnValue(of([mockRole]));
      roleService.getPermissions.and.returnValue(of([mockPermission]));

      fixture.detectChanges();

      expect(roleService.getRoles).toHaveBeenCalled();
      expect(roleService.getPermissions).toHaveBeenCalled();
      expect(component.roles()).toEqual([mockRole]);
      expect(component.permissions()).toEqual([mockPermission]);
    });

    it('should handle error when loading roles', () => {
      roleService.getRoles.and.returnValue(
        throwError(() => new Error('Failed to load roles'))
      );
      roleService.getPermissions.and.returnValue(of([mockPermission]));

      fixture.detectChanges();

      expect(component.error()).toBe('Failed to load roles');
    });
  });

  describe('Modal Operations', () => {
    it('should open create modal and reset form', () => {
      component.openCreateModal();

      expect(component.isCreateModalOpen()).toBeTrue();
      expect(component.roleName()).toBe('');
      expect(component.selectedPermissions()).toEqual([]);
    });

    it('should open edit modal with role data', () => {
      component.openEditModal(mockRole);

      expect(component.isEditModalOpen()).toBeTrue();
      expect(component.selectedRole()).toEqual(mockRole);
      expect(component.selectedPermissions()).toEqual(mockRole.permissions);
    });

    it('should open delete modal with role data', () => {
      component.openDeleteModal(mockRole);

      expect(component.isDeleteModalOpen()).toBeTrue();
      expect(component.selectedRole()).toEqual(mockRole);
    });

    it('should close all modals and reset form', () => {
      component.openEditModal(mockRole);
      component.closeModals();

      expect(component.isEditModalOpen()).toBeFalse();
      expect(component.isCreateModalOpen()).toBeFalse();
      expect(component.isDeleteModalOpen()).toBeFalse();
      expect(component.selectedRole()).toBeNull();
      expect(component.roleName()).toBe('');
      expect(component.selectedPermissions()).toEqual([]);
    });
  });

  describe('Role Operations', () => {
    it('should create role successfully', () => {
      const newRole = { name: 'New Role', permissions: [1] };
      roleService.createRole.and.returnValue(of(mockRole));
      roleService.getRoles.and.returnValue(of([mockRole]));

      component.createRole(newRole);

      expect(roleService.createRole).toHaveBeenCalledWith(newRole);
      expect(component.roles()).toEqual([mockRole]);
      expect(component.isCreateModalOpen()).toBeFalse();
    });

    it('should update role successfully when user has permission', () => {
      const updatedRole = { permissions: [1, 2] };
      roleService.updateRole.and.returnValue(of(mockRole));
      roleService.getRoles.and.returnValue(of([mockRole]));
      authService.me.and.returnValue(
        of({
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          roleId: 1,
          permissions: [RolePermissions.VIEW_ROLE],
        })
      );
      component.selectedRole.set(mockRole);

      component.updateRole(updatedRole);

      expect(roleService.updateRole).toHaveBeenCalledWith(mockRole.id, {
        name: mockRole.name,
        permissions: updatedRole.permissions,
      });
      expect(component.roles()).toEqual([mockRole]);
      expect(component.isEditModalOpen()).toBeFalse();
    });

    it('should navigate to home when user loses permission after update', () => {
      const updatedRole = { permissions: [1, 2] };
      roleService.updateRole.and.returnValue(of(mockRole));
      authService.me.and.returnValue(
        of({
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          roleId: 1,
          permissions: [],
        })
      );
      component.selectedRole.set(mockRole);

      component.updateRole(updatedRole);

      expect(router.navigateByUrl).toHaveBeenCalledWith('/');
    });

    it('should delete role successfully', () => {
      roleService.deleteRole.and.returnValue(of(void 0));
      roleService.getRoles.and.returnValue(of([]));
      component.selectedRole.set(mockRole);

      component.deleteRole();

      expect(roleService.deleteRole).toHaveBeenCalledWith(mockRole.id);
      expect(component.roles()).toEqual([]);
      expect(component.isDeleteModalOpen()).toBeFalse();
    });

    it('should handle error when creating role', () => {
      const newRole = { name: 'New Role', permissions: [1] };
      roleService.createRole.and.returnValue(
        throwError(() => new Error('Failed to create role'))
      );

      component.createRole(newRole);

      expect(component.error()).toBe('Failed to create role');
    });
  });

  describe('trackById', () => {
    it('should return role id for tracking', () => {
      expect(component.trackById(0, mockRole)).toBe(mockRole.id);
    });
  });
});
