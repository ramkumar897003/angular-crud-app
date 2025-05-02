import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Permission, Role } from '../../interfaces/role.interface';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-edit-role-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <app-modal [title]="'Edit Role: ' + role?.name">
      <form (ngSubmit)="onSubmit()" class="mt-4">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Permissions</label
            >
            <div class="mt-2 space-y-2">
              <div
                *ngFor="let permission of permissions"
                class="flex items-center"
              >
                <input
                  type="checkbox"
                  [checked]="selectedPermissions.includes(permission.id)"
                  [value]="permission.id"
                  (change)="onPermissionChange($event, permission.id)"
                  id="permission-{{ permission.id }}"
                  name="permissions"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  [for]="'permission-' + permission.id"
                  class="ml-2 block text-sm text-gray-900"
                >
                  {{ permission.name }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div
          class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
        >
          <button
            type="submit"
            class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
          >
            Save
          </button>
          <button
            type="button"
            (click)="onCancel()"
            class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </app-modal>
  `,
})
export class EditRoleModalComponent {
  @Input() role: Role | null = null;
  @Input() permissions: Permission[] = [];
  @Output() update = new EventEmitter<{ permissions: number[] }>();
  @Output() cancel = new EventEmitter<void>();

  selectedPermissions: number[] = [];

  ngOnChanges(): void {
    if (this.role) {
      this.selectedPermissions = this.role.permissions.map((p) => p);
    }
  }

  onPermissionChange(event: Event, permissionId: number): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedPermissions = [...this.selectedPermissions, permissionId];
    } else {
      this.selectedPermissions = this.selectedPermissions.filter(
        (id) => id !== permissionId
      );
    }
  }

  onSubmit(): void {
    this.update.emit({ permissions: this.selectedPermissions });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
