import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { PrimengModule } from '../../../../primeng.module';
import { ReadingService } from '../../../services';
import { Client } from '../../../../domain/models';
import { readingResponse } from '../../../../infrastructure/interfaces';
import { SkeletonModule } from 'primeng/skeleton';
import { customerTypeResponse } from '../../../../infrastructure';

interface invoiceDetail {
  customer: {
    fullname: string;
    meterNumner: string;
  };
  minimumPrice: number;
  consumption: number;
  priceByUnit: number;
  total: number;
}
@Component({
  selector: 'app-meter-reading',
  standalone: true,
  imports: [CommonModule, PrimengModule, ReactiveFormsModule, SkeletonModule],
  templateUrl: './meter-reading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeterReadingComponent implements OnInit {
  private ref = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);

  private readingService = inject(ReadingService);
  customer: Client = inject(DynamicDialogConfig).data;

  isLoading = signal<boolean>(false);
  lastReading = signal<readingResponse | null>(null);
  customerType = signal<customerTypeResponse | null>(null);

  FormReading = this.fb.nonNullable.group({
    reading: [null, Validators.required],
  });

  constructor() {
    effect(() => {
      this.FormReading.get('reading')?.setValidators([
        Validators.required,
        Validators.min(this.lastReading()?.reading ?? 0),
      ]);
    });
  }

  invoiceDetail = computed<invoiceDetail>(() => {
    return {
      customer: {
        fullname: this.customer.fullname,
        meterNumner: this.customer.meterNumber,
      },
      minimumPrice: this.customerType()?.minimumPrice ?? 0,
      consumption: 0,
      priceByUnit: 0,
      total: 0,
    };
  });

  ngOnInit(): void {
    if (!this.customer) return;
    this._getLastReading();
    // this._getCustomerType();
  }

  save() {
    this.readingService
      .create(this.customer.id, this.FormReading.value.reading!)
      .subscribe((data) => {
        this.ref.close();
      });
  }

  private _getLastReading(): void {
    this.isLoading.set(true);
    this.readingService
      .getPreviusReading(this.customer.id)
      .subscribe((data) => {
        this.lastReading.set(data);
        this.isLoading.set(false);
      });
  }

  private _getCustomerType() {
    this.readingService
      .getCustomerType(this.customer.type.id)
      .subscribe((data) => {
        this.customerType.set(data);
      });
  }

  get mini() {
    return this.lastReading()?.reading ?? 0;
  }
}
