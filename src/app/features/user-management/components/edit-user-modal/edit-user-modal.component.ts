import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../auth/interfaces/auth.interface';
import { Role } from '../../../role-management/interfaces/role.interface';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50">
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>
      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center sm:p-0"
        >
          <div
            class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
          >
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              Edit User
            </h3>
            <form (ngSubmit)="onSubmit()" class="mt-4">
              <div class="space-y-4">
                <!-- Email (Read-only) -->
                <div>
                  <label
                    for="email"
                    class="block text-sm font-medium text-gray-700"
                    >Email</label
                  >
                  <input
                    type="text"
                    id="email"
                    [value]="user.email"
                    disabled
                    class="p-3 mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 text-gray-500 sm:text-sm"
                  />
                </div>

                <!-- Full Name -->
                <div>
                  <label
                    for="fullName"
                    class="block text-sm font-medium text-gray-700"
                    >Full Name</label
                  >
                  <input
                    type="text"
                    id="fullName"
                    [(ngModel)]="fullName"
                    name="fullName"
                    required
                    #fullNameInput="ngModel"
                    class="p-3 mt-1 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    [class.border-red-500]="
                      fullNameInput.invalid && fullNameInput.touched
                    "
                  />
                  <div
                    *ngIf="fullNameInput.invalid && fullNameInput.touched"
                    class="mt-1 text-sm text-red-600"
                  >
                    Full name is required
                  </div>
                </div>

                <!-- Password -->
                <div>
                  <label
                    for="password"
                    class="block text-sm font-medium text-gray-700"
                    >Password</label
                  >
                  <input
                    type="password"
                    id="password"
                    [(ngModel)]="password"
                    name="password"
                    class="p-3 mt-1 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Leave blank to keep current password"
                  />
                </div>

                <!-- Role Selection -->
                <div>
                  <label
                    for="role"
                    class="block text-sm font-medium text-gray-700"
                    >Role</label
                  >
                  <select
                    id="role"
                    [(ngModel)]="selectedRoleId"
                    name="role"
                    required
                    #roleInput="ngModel"
                    class="p-3 mt-1 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    [class.border-red-500]="
                      roleInput.invalid && roleInput.touched
                    "
                  >
                    <option value="">Select a role</option>
                    <option *ngFor="let role of roles" [value]="role.id">
                      {{ role.name }}
                    </option>
                  </select>
                  <div
                    *ngIf="roleInput.invalid && roleInput.touched"
                    class="mt-1 text-sm text-red-600"
                  >
                    Role is required
                  </div>
                </div>
              </div>

              <div
                class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
              >
                <button
                  type="submit"
                  [disabled]="!isFormValid()"
                  class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
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
          </div>
        </div>
      </div>
    </div>
  `,
})
export class EditUserModalComponent {
  @Input() user!: User;
  @Input() roles: Role[] = [];
  @Output() update = new EventEmitter<{
    id: number;
    fullName: string;
    password?: string;
    roleId: number;
  }>();
  @Output() cancel = new EventEmitter<void>();

  fullName = '';
  password = '';
  selectedRoleId: number | null = null;

  ngOnInit() {
    this.fullName = this.user.name;
    this.selectedRoleId = this.user.roleId;
  }

  isFormValid(): boolean {
    return !!this.fullName && !!this.selectedRoleId;
  }

  onSubmit() {
    if (!this.isFormValid()) return;

    this.update.emit({
      id: this.user.id,
      fullName: this.fullName,
      password: this.password || undefined,
      roleId: this.selectedRoleId!,
    });
  }

  onCancel() {
    this.cancel.emit();
  }
}
