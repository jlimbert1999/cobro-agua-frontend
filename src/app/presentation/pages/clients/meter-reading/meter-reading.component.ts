import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';

import { Reading, Client } from '../../../../domain';
import { ReadingService } from '../../../services';
import { ButtonModule } from 'primeng/button';
import { forkJoin } from 'rxjs';

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
    CheckboxModule,
  ],
  templateUrl: './meter-reading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeterReadingComponent implements OnInit {
  private ref = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);
  private readingService = inject(ReadingService);

  private readonly currentDate = new Date();

  customer: Client = inject(DynamicDialogConfig).data;

  isLoading = signal<boolean>(false);
  previusReading = signal<Reading | null>(null);
  readingDate = signal(
    new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1)
  );

  FormReading: FormGroup = this.fb.nonNullable.group({
    reading: [null, Validators.required],
    isNew: [false],
  });

  ngOnInit(): void {
    if (!this.customer) return;
    this._getReadingDetails();
  }

  save() {
    this.readingService
      .create(this.customer.id, this.FormReading.value!)
      .subscribe(() => {
        this.ref.close();
      });
  }

  private _getReadingDetails(): void {
    this.isLoading.set(true);
    forkJoin([
      this.readingService.getLPreviusReading(this.customer.id),
      this.readingService.getCurrentReading(this.customer.id),
    ]).subscribe(([previus, current]) => {
      this.previusReading.set(previus);
      this.FormReading.get('reading')?.setValue(current?.reading);
      if (current) {
        this.readingDate.set(new Date(current.year, current.month));
      }
      this.isLoading.set(false);
    });
  }
}
