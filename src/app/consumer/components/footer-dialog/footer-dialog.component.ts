import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PrimengModule } from '../../../primeng/primeng.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-footer-dialog',
  standalone: true,
  imports: [CommonModule, PrimengModule],
  template: `
    <div class="flex w-full justify-content-end mt-3">
      <p-button
        type="button"
        label="Cancel"
        icon="pi pi-times"
        (click)="
          closeDialog()
        "
      ></p-button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterDialogComponent {
  constructor(public ref: DynamicDialogRef) {}

  closeDialog() {
    this.ref.close();
  }
}
