import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { CreateRoleModalComponent } from './create-role-modal.component';
import { RoleService } from '../../services/role.service';
import { of } from 'rxjs';
import { Permission, Role } from '../../interfaces/role.interface';
import { FormsModule, NgModel } from '@angular/forms';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { By } from '@angular/platform-browser';

describe('CreateRoleModalComponent', () => {
  let component: CreateRoleModalComponent;
  let fixture: ComponentFixture<CreateRoleModalComponent>;
  let roleService: jasmine.SpyObj<RoleService>;

  const mockPermissions: Permission[] = [
    { id: 1, name: 'View User' },
    { id: 2, name: 'Edit User' },
  ];

  const mockExistingRoles: Role[] = [
    { id: 1, name: 'Admin', permissions: [1, 2] },
  ];

  beforeEach(async () => {
    const roleServiceSpy = jasmine.createSpyObj('RoleService', [
      'checkRoleNameExists',
    ]);

    await TestBed.configureTestingModule({
      imports: [CreateRoleModalComponent, FormsModule, ModalComponent],
      providers: [{ provide: RoleService, useValue: roleServiceSpy }],
    }).compileComponents();

    roleService = TestBed.inject(RoleService) as jasmine.SpyObj<RoleService>;
    fixture = TestBed.createComponent(CreateRoleModalComponent);
    component = fixture.componentInstance;
    component.permissions = mockPermissions;
    component.existingRoles = mockExistingRoles;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize with empty form values', () => {
      expect(component.roleName()).toBe('');
      expect(component.selectedPermissions()).toEqual([]);
      expect(component.isNameDuplicate()).toBeFalse();
    });

    it('should display all available permissions', () => {
      fixture.detectChanges();
      const permissionCheckboxes = fixture.nativeElement.querySelectorAll(
        'input[type="checkbox"]'
      );
      expect(permissionCheckboxes.length).toBe(mockPermissions.length);
    });
  });

  describe('Role Name Validation', () => {
    it('should check for duplicate names after debounce', fakeAsync(() => {
      roleService.checkRoleNameExists.and.returnValue(of(true));

      component.roleName.set('Admin');
      component.onRoleNameInput();
      tick(300);

      expect(roleService.checkRoleNameExists).toHaveBeenCalledWith('Admin');
      expect(component.isNameDuplicate()).toBeTrue();
    }));

    it('should not check for duplicates if name is empty', fakeAsync(() => {
      component.roleName.set('');
      component.onRoleNameInput();
      tick(300);

      expect(roleService.checkRoleNameExists).not.toHaveBeenCalled();
      expect(component.isNameDuplicate()).toBeFalse();
    }));

    it('should show validation error for empty name when touched', async () => {
      // Initial setup
      fixture.detectChanges();

      // Get the input element and its NgModel
      const input = fixture.debugElement.query(By.css('#role-name'));
      const ngModel = input.injector.get(NgModel);
      expect(input).withContext('Input element should exist').toBeTruthy();

      // Set empty value
      component.roleName.set('');

      // Trigger input event
      input.triggerEventHandler('input', { target: input.nativeElement });
      await fixture.whenStable();

      // Mark as touched
      ngModel.control.markAsTouched();
      ngModel.control.updateValueAndValidity();
      fixture.detectChanges();
      await fixture.whenStable();

      // Check for error message
      const errorMessage = fixture.debugElement.query(By.css('.text-red-600'));
      expect(errorMessage)
        .withContext('Error message element should exist')
        .toBeTruthy();
      expect(errorMessage.nativeElement.textContent.trim()).toBe(
        'Role name is required'
      );
    });
  });

  describe('Permission Selection', () => {
    it('should add permission when checkbox is checked', () => {
      const event = { target: { checked: true } } as unknown as Event;
      component.onPermissionChange(event, 1);

      expect(component.selectedPermissions()).toContain(1);
    });

    it('should remove permission when checkbox is unchecked', () => {
      component.selectedPermissions.set([1, 2]);
      const event = { target: { checked: false } } as unknown as Event;
      component.onPermissionChange(event, 1);

      expect(component.selectedPermissions()).not.toContain(1);
      expect(component.selectedPermissions()).toContain(2);
    });
  });

  describe('Form Submission', () => {
    it('should emit create event with form data when submitted', () => {
      spyOn(component.create, 'emit');
      component.roleName.set('New Role');
      component.selectedPermissions.set([1, 2]);
      roleService.checkRoleNameExists.and.returnValue(of(false));

      component.onSubmit();

      expect(component.create.emit).toHaveBeenCalledWith({
        name: 'New Role',
        permissions: [1, 2],
      });
    });

    it('should not emit create event if name is duplicate', fakeAsync(() => {
      spyOn(component.create, 'emit');
      roleService.checkRoleNameExists.and.returnValue(of(true));

      // Set name and trigger validation
      component.roleName.set('Admin');
      component.onRoleNameInput();
      tick(300); // Wait for debounce
      fixture.detectChanges();

      // Try to submit
      component.onSubmit();

      expect(component.create.emit).not.toHaveBeenCalled();
    }));
  });

  describe('Cancel Action', () => {
    it('should emit cancel event when cancel button is clicked', () => {
      spyOn(component.cancel, 'emit');

      component.onCancel();

      expect(component.cancel.emit).toHaveBeenCalled();
    });
  });
});
