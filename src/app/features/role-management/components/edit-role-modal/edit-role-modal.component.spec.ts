import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditRoleModalComponent } from './edit-role-modal.component';
import { Permission, Role } from '../../interfaces/role.interface';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { By } from '@angular/platform-browser';

describe('EditRoleModalComponent', () => {
  let component: EditRoleModalComponent;
  let fixture: ComponentFixture<EditRoleModalComponent>;

  const mockRole: Role = {
    id: 1,
    name: 'Admin',
    permissions: [1, 2],
  };

  const mockPermissions: Permission[] = [
    { id: 1, name: 'View User' },
    { id: 2, name: 'Edit User' },
    { id: 3, name: 'Delete User' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRoleModalComponent, FormsModule, ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditRoleModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with empty permissions when no role is provided', () => {
      fixture.detectChanges();
      expect(component.selectedPermissions()).toEqual([]);
    });

    it('should initialize with role permissions when role is provided', () => {
      component.role = mockRole;
      component.ngOnChanges();
      fixture.detectChanges();

      expect(component.selectedPermissions()).toEqual(mockRole.permissions);
    });

    it('should display all available permissions', () => {
      component.permissions = mockPermissions;
      fixture.detectChanges();

      const permissionCheckboxes = fixture.nativeElement.querySelectorAll(
        'input[type="checkbox"]'
      );
      expect(permissionCheckboxes.length).toBe(mockPermissions.length);
    });

    it('should display role name in modal title', () => {
      component.role = mockRole;
      fixture.detectChanges();

      const modal = fixture.debugElement.query(By.directive(ModalComponent));
      expect(modal.componentInstance.title).toBe('Edit Role: Admin');
    });
  });

  describe('Permission Selection', () => {
    beforeEach(() => {
      component.role = mockRole;
      component.permissions = mockPermissions;
      component.ngOnChanges();
      fixture.detectChanges();
    });

    it('should add permission when checkbox is checked', () => {
      const event = { target: { checked: true } } as unknown as Event;
      component.onPermissionChange(event, 3);

      expect(component.selectedPermissions()).toContain(3);
      expect(component.selectedPermissions().length).toBe(3);
    });

    it('should remove permission when checkbox is unchecked', () => {
      const event = { target: { checked: false } } as unknown as Event;
      component.onPermissionChange(event, 1);

      expect(component.selectedPermissions()).not.toContain(1);
      expect(component.selectedPermissions()).toContain(2);
    });

    it('should maintain existing permissions when adding new ones', () => {
      const event = { target: { checked: true } } as unknown as Event;
      component.onPermissionChange(event, 3);

      expect(component.selectedPermissions()).toEqual([1, 2, 3]);
    });
  });

  describe('Form Submission', () => {
    it('should emit update event with selected permissions', () => {
      spyOn(component.update, 'emit');
      component.role = mockRole;
      component.ngOnChanges();
      fixture.detectChanges();

      component.onSubmit();

      expect(component.update.emit).toHaveBeenCalledWith({
        permissions: mockRole.permissions,
      });
    });

    it('should emit cancel event when cancel button is clicked', () => {
      spyOn(component.cancel, 'emit');

      component.onCancel();

      expect(component.cancel.emit).toHaveBeenCalled();
    });
  });
});
