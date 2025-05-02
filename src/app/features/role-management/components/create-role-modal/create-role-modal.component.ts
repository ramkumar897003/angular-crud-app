import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Permission, Role } from '../../interfaces/role.interface';
import { RoleService } from '../../services/role.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-create-role-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal title="Create New Role">
      <form (ngSubmit)="onSubmit()" class="mt-4">
        <div class="space-y-4">
          <div>
            <label
              for="role-name"
              class="block text-sm font-medium text-gray-700"
              >Role Name</label
            >
            <input
              type="text"
              id="role-name"
              [(ngModel)]="roleName"
              name="roleName"
              required
              #roleNameInput="ngModel"
              (input)="onRoleNameInput()"
              class="p-3 mt-1 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              [class.border-red-500]="
                (roleNameInput.invalid && roleNameInput.touched) ||
                isNameDuplicate()
              "
            />
            <div
              *ngIf="roleNameInput.invalid && roleNameInput.touched"
              class="mt-1 text-sm text-red-600"
            >
              Role name is required
            </div>
            <div *ngIf="isNameDuplicate()" class="mt-1 text-sm text-red-600">
              A role with this name already exists
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Permissions</label
            >
            <div class="mt-2 space-y-2">
              <div
                *ngFor="let permission of permissions; trackBy: trackById"
                class="flex items-center"
              >
                <input
                  type="checkbox"
                  [id]="'permission-' + permission.id"
                  [value]="permission.id"
                  [checked]="selectedPermissions().includes(permission.id)"
                  (change)="onPermissionChange($event, permission.id)"
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
            [disabled]="!roleNameInput.valid || isNameDuplicate()"
            class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
export class CreateRoleModalComponent {
  private readonly roleService = inject(RoleService);
  private readonly nameValidationSubject = new Subject<string>();

  @Input() permissions: Permission[] = [];
  @Input() existingRoles: Role[] = [];
  @Output() create = new EventEmitter<{
    name: string;
    permissions: number[];
  }>();
  @Output() cancel = new EventEmitter<void>();

  roleName = signal('');
  selectedPermissions = signal<number[]>([]);
  isNameDuplicate = signal(false);

  constructor() {
    this.nameValidationSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((name) => {
        this.checkNameDuplicate(name);
      });
  }

  trackById(_index: number, item: Permission): number {
    return item.id;
  }

  checkNameDuplicate(name: string) {
    if (name) {
      this.roleService
        .checkRoleNameExists(name)
        .subscribe((exists) => this.isNameDuplicate.set(exists));
    } else {
      this.isNameDuplicate.set(false);
    }
  }

  onRoleNameInput(): void {
    this.nameValidationSubject.next(this.roleName());
  }

  onPermissionChange(event: Event, permissionId: number): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedPermissions.set([
        ...this.selectedPermissions(),
        permissionId,
      ]);
    } else {
      this.selectedPermissions.set(
        this.selectedPermissions().filter((id) => id !== permissionId)
      );
    }
  }

  onSubmit(): void {
    if (!this.isNameDuplicate()) {
      this.create.emit({
        name: this.roleName(),
        permissions: this.selectedPermissions(),
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
