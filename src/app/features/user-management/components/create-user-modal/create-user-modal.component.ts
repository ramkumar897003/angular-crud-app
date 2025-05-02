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
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../../auth/interfaces/auth.interface';
import { Role } from '../../../role-management/interfaces/role.interface';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-create-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal title="Create New User">
      <form (ngSubmit)="onSubmit()" class="mt-4">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"
              >Email</label
            >
            <input
              type="text"
              id="email"
              [(ngModel)]="email"
              name="email"
              required
              #emailInput="ngModel"
              (input)="onEmailInput()"
              class="p-3 mt-1 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              [class.border-red-500]="
                (emailInput.invalid && emailInput.touched) || isEmailDuplicate()
              "
            />
            <div
              *ngIf="emailInput.invalid && emailInput.touched"
              class="mt-1 text-sm text-red-600"
            >
              Email is required
            </div>
            <div *ngIf="isEmailDuplicate()" class="mt-1 text-sm text-red-600">
              This email is already taken
            </div>
          </div>
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
              required
              #passwordInput="ngModel"
              class="p-3 mt-1 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              [class.border-red-500]="
                passwordInput.invalid && passwordInput.touched
              "
            />
            <div
              *ngIf="passwordInput.invalid && passwordInput.touched"
              class="mt-1 text-sm text-red-600"
            >
              Password is required
            </div>
          </div>
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700"
              >Role</label
            >
            <select
              id="role"
              [(ngModel)]="selectedRoleId"
              name="role"
              required
              #roleInput="ngModel"
              class="p-3 mt-1 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              [class.border-red-500]="roleInput.invalid && roleInput.touched"
            >
              <option value="">Select a role</option>
              <option
                *ngFor="let role of roles; trackBy: trackById"
                [ngValue]="role.id"
              >
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
            Create User
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
export class CreateUserModalComponent {
  private readonly userService = inject(UserService);
  private readonly emailValidationSubject = new Subject<string>();

  @Input() roles: Role[] = [];
  @Input() existingUsers: User[] = [];
  @Output() create = new EventEmitter<{
    email: string;
    fullName: string;
    password: string;
    roleId: number;
  }>();
  @Output() cancel = new EventEmitter<void>();

  email = signal('');
  fullName = signal('');
  password = signal('');
  selectedRoleId = signal<number | null>(null);
  isEmailDuplicate = signal(false);

  constructor() {
    this.emailValidationSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((email) => {
        this.checkEmailDuplicate(email);
      });
  }

  trackById(_index: number, item: Role): number {
    return item.id;
  }

  onEmailInput() {
    this.emailValidationSubject.next(this.email());
  }

  private checkEmailDuplicate(email: string) {
    if (email) {
      this.userService
        .checkEmailExists(email)
        .subscribe((exists) => this.isEmailDuplicate.set(exists));
    } else {
      this.isEmailDuplicate.set(false);
    }
  }

  isFormValid(): boolean {
    return (
      !!this.email() &&
      !!this.fullName() &&
      !!this.password() &&
      !!this.selectedRoleId() &&
      !this.isEmailDuplicate()
    );
  }

  onSubmit() {
    if (!this.isFormValid()) return;

    this.create.emit({
      email: this.email(),
      fullName: this.fullName(),
      password: this.password(),
      roleId: this.selectedRoleId()!,
    });
  }

  onCancel() {
    this.cancel.emit();
  }
}
