import { TestBed } from '@angular/core/testing';
import { RoleRepository } from './role.repository';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  Role,
  Permission,
  CreateRoleRequest,
  UpdateRoleRequest,
} from '../interfaces/role.interface';

describe('RoleRepository', () => {
  let repository: RoleRepository;
  let httpMock: HttpTestingController;

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
    TestBed.configureTestingModule({
      providers: [
        RoleRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    repository = TestBed.inject(RoleRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  describe('getRoles', () => {
    it('should fetch roles from API', (done) => {
      repository.getRoles().subscribe({
        next: (roles) => {
          expect(roles).toEqual([mockRole]);
          done();
        },
        error: done.fail,
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/roles`);
      expect(req.request.method).toBe('GET');
      req.flush([mockRole]);
    });

    it('should handle error when fetching roles', (done) => {
      repository.getRoles().subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/roles`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('getRole', () => {
    it('should fetch role by id from API', (done) => {
      repository.getRole(1).subscribe({
        next: (role) => {
          expect(role).toEqual(mockRole);
          done();
        },
        error: done.fail,
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/roles/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockRole);
    });

    it('should handle error when fetching role', (done) => {
      repository.getRole(1).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/roles/1`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('getPermissions', () => {
    it('should fetch permissions from API', (done) => {
      repository.getPermissions().subscribe({
        next: (permissions) => {
          expect(permissions).toEqual([mockPermission]);
          done();
        },
        error: done.fail,
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/permissions`);
      expect(req.request.method).toBe('GET');
      req.flush([mockPermission]);
    });

    it('should handle error when fetching permissions', (done) => {
      repository.getPermissions().subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/permissions`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('createRole', () => {
    it('should create role via API', (done) => {
      repository.createRole(mockCreateRoleRequest).subscribe({
        next: (role) => {
          expect(role).toEqual(mockRole);
          done();
        },
        error: done.fail,
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/roles`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateRoleRequest);
      req.flush(mockRole);
    });

    it('should handle error when creating role', (done) => {
      repository.createRole(mockCreateRoleRequest).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/roles`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('updateRole', () => {
    it('should update role via API', (done) => {
      repository.updateRole(1, mockUpdateRoleRequest).subscribe({
        next: (role) => {
          expect(role).toEqual(mockRole);
          done();
        },
        error: done.fail,
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/roles/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockUpdateRoleRequest);
      req.flush(mockRole);
    });

    it('should handle error when updating role', (done) => {
      repository.updateRole(1, mockUpdateRoleRequest).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/roles/1`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('deleteRole', () => {
    it('should delete role via API', (done) => {
      repository.deleteRole(1).subscribe({
        next: () => {
          done();
        },
        error: done.fail,
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/roles/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle error when deleting role', (done) => {
      repository.deleteRole(1).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/roles/1`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('checkRoleNameExists', () => {
    it('should check if role name exists', (done) => {
      repository.checkRoleNameExists('Admin').subscribe({
        next: (exists) => {
          expect(exists).toBeTrue();
          done();
        },
        error: done.fail,
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/roles?name=Admin`);
      expect(req.request.method).toBe('GET');
      req.flush([mockRole]);
    });

    it('should return false when role name does not exist', (done) => {
      repository.checkRoleNameExists('NonExistent').subscribe({
        next: (exists) => {
          expect(exists).toBeFalse();
          done();
        },
        error: done.fail,
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/roles?name=NonExistent`
      );
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should handle error when checking role name', (done) => {
      repository.checkRoleNameExists('Admin').subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/roles?name=Admin`);
      req.error(new ErrorEvent('Network error'));
    });
  });
});
