import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteModalComponent {
  @Input() title = '';
  @Input() disableDelete = false;
  @Output() delete = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onDelete() {
    this.delete.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
