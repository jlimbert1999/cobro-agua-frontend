import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CustomerTypeService } from '../../../../services';
import { customerType } from '../../../../../infrastructure';

@Component({
  selector: 'app-customer-type',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './customer-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerTypeComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private customerTypeService = inject(CustomerTypeService);
  private dialogRef = inject(DynamicDialogRef);

  customerType: customerType = inject(DynamicDialogConfig).data;
  formCustomerType: FormGroup = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    maxDelayMonths: [0, Validators.required],
    preferences: this.formBuilder.array([]),
  });

  ngOnInit(): void {
    this._loadFormData();
  }

  addRange() {
    this.preferences.push(
      this.formBuilder.group({
        maxUnits: [0, Validators.required],
        minUnits: [0, Validators.required],
        priceByUnit: [0, Validators.required],
      })
    );
  }

  save() {
    const subscription = this.customerType
      ? this.customerTypeService.update(
          this.customerType.id,
          this.formCustomerType.value
        )
      : this.customerTypeService.create(this.formCustomerType.value);

    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }

  get preferences() {
    return this.formCustomerType.get('preferences') as FormArray;
  }

  private _loadFormData(): void {
    if (!this.customerType) return;
    this.customerType.preferences.forEach(() => this.addRange());
    this.formCustomerType.patchValue(this.customerType);
  }
}
