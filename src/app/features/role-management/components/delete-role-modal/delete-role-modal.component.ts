import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Role } from '../../interfaces/role.interface';
import { DeleteModalComponent } from '../../../../shared/components/delete-modal/delete-modal.component';

@Component({
  selector: 'app-delete-role-modal',
  standalone: true,
  imports: [CommonModule, DeleteModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-delete-modal
      title="Delete Role"
      (delete)="onDelete()"
      (cancel)="onCancel()"
    >
      <p class="text-sm text-gray-500">
        Are you sure you want to delete the role "{{ role?.name }}"? This action
        cannot be undone.
      </p>
      <p
        *ngIf="role?.id === currentUserRoleId"
        class="mt-2 text-sm text-red-600"
      >
        Warning: This role is assigned to you. You cannot delete it.
      </p>
    </app-delete-modal>
  `,
})
export class DeleteRoleModalComponent {
  @Input() role: Role | null = null;
  @Input() currentUserRoleId!: number | undefined;
  @Output() delete = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onDelete(): void {
    this.delete.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
