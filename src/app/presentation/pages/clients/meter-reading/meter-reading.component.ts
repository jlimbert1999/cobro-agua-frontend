import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';

import { Reading, Client } from '../../../../domain';
import { ReadingService } from '../../../services';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'meter-reading',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AccordionModule,
    InputTextModule,
    ProgressBarModule,
    InputNumberModule,
    ButtonModule,
  ],
  templateUrl: './meter-reading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeterReadingComponent implements OnInit {
  private ref = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);
  private readingService = inject(ReadingService);

  private readonly dateReading = new Date();

  customer: Client = inject(DynamicDialogConfig).data;

  isLoading = signal<boolean>(false);
  lastReading = signal<Reading | null>(null);

  FormReading = this.fb.nonNullable.group({
    reading: [null, Validators.required],
  });

  ngOnInit(): void {
    if (!this.customer) return;
    this._getLastReading();
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
    this.readingService.getLastReading(this.customer.id).subscribe((data) => {
      this.lastReading.set(data);
      this.isLoading.set(false);
    });
  }

  get dateReadingLabel() {
    const date = new Date(
      this.dateReading.getFullYear(),
      this.dateReading.getMonth() - 1
    );
    return date;
  }
}
