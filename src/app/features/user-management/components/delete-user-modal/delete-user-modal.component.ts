import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../auth/interfaces/auth.interface';
import { DeleteModalComponent } from '../../../../shared/components/delete-modal/delete-modal.component';

@Component({
  selector: 'app-delete-user-modal',
  standalone: true,
  imports: [CommonModule, DeleteModalComponent],
  template: `
    <app-delete-modal
      title="Delete User"
      (delete)="onDelete()"
      (cancel)="onCancel()"
    >
      <p class="text-sm text-gray-500">
        Are you sure you want to delete the user "{{ user?.name }}"? This action
        cannot be undone.
      </p>
    </app-delete-modal>
  `,
})
export class DeleteUserModalComponent {
  @Input() user: User | null = null;
  @Output() delete = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onDelete(): void {
    this.delete.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
