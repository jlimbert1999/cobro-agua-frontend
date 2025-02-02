import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

import { DiscountService } from '../../../../services';
import { discount } from '../../../../../infrastructure';

@Component({
  selector: 'app-discount-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
  ],
  template: `
    <div class="p-dialog-content">
      <form [formGroup]="discountForm">
        <div class="formgrid grid">
          <div class="field col-12 sm:col-8">
            <label for="name">Nombre</label>
            <input
              id="name"
              type="text"
              class="w-full"
              pInputText
              placeholder="Nombre del descuento"
              formControlName="name"
            />
          </div>
          <div class="field col-12 sm:col-4">
            <label for="maxDelayMonths">Porcentaje</label>
            <p-inputNumber
              inputStyleClass="w-full"
              formControlName="percentage"
              [max]="100"
              [min]="1"
              prefix="% "
            />
          </div>
        </div>
      </form>
    </div>
    <div class="p-dialog-footer">
      <p-button label="Guardar" [disabled]="!discountForm" (onClick)="save()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscountDialogComponent implements OnInit {
  private discountService = inject(DiscountService);
  private dialogRef = inject(DynamicDialogRef);
  data?: discount = inject(DynamicDialogConfig).data;

  discountForm = inject(FormBuilder).group({
    name: ['', Validators.required],
    percentage: [0, Validators.required],
  });

  ngOnInit(): void {
    this.discountForm.patchValue(this.data ?? {});
  }

  save() {
    const subscription = this.data
      ? this.discountService.update(this.data.id, this.discountForm.value)
      : this.discountService.create(this.discountForm.value);

    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }
}
