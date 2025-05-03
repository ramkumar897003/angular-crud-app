import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteRoleModalComponent } from './delete-role-modal.component';
import { Role } from '../../interfaces/role.interface';
import { DeleteModalComponent } from '../../../../shared/components/delete-modal/delete-modal.component';
import { By } from '@angular/platform-browser';

describe('DeleteRoleModalComponent', () => {
  let component: DeleteRoleModalComponent;
  let fixture: ComponentFixture<DeleteRoleModalComponent>;

  const mockRole: Role = {
    id: 1,
    name: 'Admin',
    permissions: [1, 2],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteRoleModalComponent, DeleteModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteRoleModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should display role name in confirmation message', () => {
      component.role = mockRole;
      fixture.detectChanges();

      const message =
        fixture.nativeElement.querySelector('p.text-gray-500').textContent;
      expect(message).toContain(
        'Are you sure you want to delete the role "Admin"?'
      );
    });

    it('should not show warning message when role is not current user role', () => {
      component.role = mockRole;
      component.currentUserRoleId = 2;
      fixture.detectChanges();

      const warningMessage =
        fixture.nativeElement.querySelector('p.text-red-600');
      expect(warningMessage).toBeNull();
    });

    it('should show warning message when role is current user role', () => {
      component.role = mockRole;
      component.currentUserRoleId = 1;
      fixture.detectChanges();

      const warningMessage =
        fixture.nativeElement.querySelector('p.text-red-600');
      expect(warningMessage).toBeTruthy();
      expect(warningMessage.textContent).toContain(
        'Warning: This role is assigned to you'
      );
    });
  });

  describe('Event Handling', () => {
    it('should emit delete event when delete is confirmed', () => {
      spyOn(component.delete, 'emit');

      component.onDelete();

      expect(component.delete.emit).toHaveBeenCalled();
    });

    it('should emit cancel event when cancel is clicked', () => {
      spyOn(component.cancel, 'emit');

      component.onCancel();

      expect(component.cancel.emit).toHaveBeenCalled();
    });
  });

  describe('DeleteModal Integration', () => {
    it('should pass correct title to delete modal', () => {
      fixture.detectChanges();

      const deleteModal = fixture.debugElement.query(
        By.directive(DeleteModalComponent)
      );
      expect(deleteModal.componentInstance.title).toBe('Delete Role');
    });

    it('should handle delete event from delete modal', () => {
      spyOn(component.delete, 'emit');
      fixture.detectChanges();

      const deleteModal = fixture.debugElement.query(
        By.directive(DeleteModalComponent)
      );
      deleteModal.componentInstance.delete.emit();

      expect(component.delete.emit).toHaveBeenCalled();
    });

    it('should handle cancel event from delete modal', () => {
      spyOn(component.cancel, 'emit');
      fixture.detectChanges();

      const deleteModal = fixture.debugElement.query(
        By.directive(DeleteModalComponent)
      );
      deleteModal.componentInstance.cancel.emit();

      expect(component.cancel.emit).toHaveBeenCalled();
    });
  });
});
