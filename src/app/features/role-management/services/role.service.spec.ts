import { TestBed } from '@angular/core/testing';
import { RoleService } from './role.service';
import { RoleRepository } from '../repository/role.repository';
import { of, throwError } from 'rxjs';
import {
  Role,
  Permission,
  CreateRoleRequest,
  UpdateRoleRequest,
} from '../interfaces/role.interface';

describe('RoleService', () => {
  let service: RoleService;
  let roleRepository: jasmine.SpyObj<RoleRepository>;

  const mockRole: Role = {
    id: 1,
    name: 'Admin',
    permissions: [1, 2],
  };

  const mockPermission: Permission = {
    id: 1,
    name: 'View User',
  };

  const mockCreateRoleRequest: CreateRoleRequest = {
    name: 'New Role',
    permissions: [1],
  };

  const mockUpdateRoleRequest: UpdateRoleRequest = {
    name: 'Updated Role',
    permissions: [1, 2],
  };

  beforeEach(() => {
    const roleRepositorySpy = jasmine.createSpyObj('RoleRepository', [
      'getRoles',
      'getRole',
      'createRole',
      'updateRole',
      'deleteRole',
      'getPermissions',
      'checkRoleNameExists',
    ]);

    TestBed.configureTestingModule({
      providers: [
        RoleService,
        { provide: RoleRepository, useValue: roleRepositorySpy },
      ],
    });

    service = TestBed.inject(RoleService);
    roleRepository = TestBed.inject(
      RoleRepository
    ) as jasmine.SpyObj<RoleRepository>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRoles', () => {
    it('should return roles from repository', (done) => {
      roleRepository.getRoles.and.returnValue(of([mockRole]));

      service.getRoles().subscribe({
        next: (roles) => {
          expect(roles).toEqual([mockRole]);
          expect(roleRepository.getRoles).toHaveBeenCalled();
          done();
        },
        error: done.fail,
      });
    });

    it('should handle error when fetching roles', (done) => {
      roleRepository.getRoles.and.returnValue(
        throwError(() => new Error('Network error'))
      );

      service.getRoles().subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to fetch roles');
          done();
        },
      });
    });
  });

  describe('getRole', () => {
    it('should return role from repository', (done) => {
      roleRepository.getRole.and.returnValue(of(mockRole));

      service.getRole(1).subscribe({
        next: (role) => {
          expect(role).toEqual(mockRole);
          expect(roleRepository.getRole).toHaveBeenCalledWith(1);
          done();
        },
        error: done.fail,
      });
    });

    it('should handle error when fetching role', (done) => {
      roleRepository.getRole.and.returnValue(
        throwError(() => new Error('Network error'))
      );

      service.getRole(1).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to fetch role');
          done();
        },
      });
    });
  });

  describe('createRole', () => {
    it('should create role via repository', (done) => {
      roleRepository.createRole.and.returnValue(of(mockRole));

      service.createRole(mockCreateRoleRequest).subscribe({
        next: (role) => {
          expect(role).toEqual(mockRole);
          expect(roleRepository.createRole).toHaveBeenCalledWith(
            mockCreateRoleRequest
          );
          done();
        },
        error: done.fail,
      });
    });

    it('should handle error when creating role', (done) => {
      roleRepository.createRole.and.returnValue(
        throwError(() => new Error('Network error'))
      );

      service.createRole(mockCreateRoleRequest).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to create role');
          done();
        },
      });
    });
  });

  describe('updateRole', () => {
    it('should update role via repository', (done) => {
      roleRepository.updateRole.and.returnValue(of(mockRole));

      service.updateRole(1, mockUpdateRoleRequest).subscribe({
        next: (role) => {
          expect(role).toEqual(mockRole);
          expect(roleRepository.updateRole).toHaveBeenCalledWith(
            1,
            mockUpdateRoleRequest
          );
          done();
        },
        error: done.fail,
      });
    });

    it('should handle error when updating role', (done) => {
      roleRepository.updateRole.and.returnValue(
        throwError(() => new Error('Network error'))
      );

      service.updateRole(1, mockUpdateRoleRequest).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to update role');
          done();
        },
      });
    });
  });

  describe('deleteRole', () => {
    it('should delete role via repository', (done) => {
      roleRepository.deleteRole.and.returnValue(of(void 0));

      service.deleteRole(1).subscribe({
        next: () => {
          expect(roleRepository.deleteRole).toHaveBeenCalledWith(1);
          done();
        },
        error: done.fail,
      });
    });

    it('should handle error when deleting role', (done) => {
      roleRepository.deleteRole.and.returnValue(
        throwError(() => new Error('Network error'))
      );

      service.deleteRole(1).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to delete role');
          done();
        },
      });
    });
  });

  describe('getPermissions', () => {
    it('should return permissions from repository', (done) => {
      roleRepository.getPermissions.and.returnValue(of([mockPermission]));

      service.getPermissions().subscribe({
        next: (permissions) => {
          expect(permissions).toEqual([mockPermission]);
          expect(roleRepository.getPermissions).toHaveBeenCalled();
          done();
        },
        error: done.fail,
      });
    });

    it('should handle error when fetching permissions', (done) => {
      roleRepository.getPermissions.and.returnValue(
        throwError(() => new Error('Network error'))
      );

      service.getPermissions().subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to fetch permissions');
          done();
        },
      });
    });
  });

  describe('checkRoleNameExists', () => {
    it('should check role name via repository', (done) => {
      roleRepository.checkRoleNameExists.and.returnValue(of(true));

      service.checkRoleNameExists('Admin').subscribe({
        next: (exists) => {
          expect(exists).toBeTrue();
          expect(roleRepository.checkRoleNameExists).toHaveBeenCalledWith(
            'Admin'
          );
          done();
        },
        error: done.fail,
      });
    });

    it('should handle error when checking role name', (done) => {
      roleRepository.checkRoleNameExists.and.returnValue(
        throwError(() => new Error('Network error'))
      );

      service.checkRoleNameExists('Admin').subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to check role name');
          done();
        },
      });
    });
  });
});
