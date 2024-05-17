import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimengModule } from '../../../../primeng.module';
import { ReadingService, ConfigService } from '../../../services';
import { Client } from '../../../../domain/models';
import { toSignal } from '@angular/core/rxjs-interop';

interface lastConsume {
  consume: number;
  date: string;
}
@Component({
  selector: 'app-meter-reading',
  standalone: true,
  imports: [CommonModule, PrimengModule, ReactiveFormsModule],
  templateUrl: './meter-reading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeterReadingComponent implements OnInit {
  private ref = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);

  private readingService = inject(ReadingService);
  private configService = inject(ConfigService);
  private client: Client = inject(DynamicDialogConfig).data;

  priviusReading = toSignal(
    this.readingService.getPreviusReading(this.client.id)
  );

  FormReading = this.fb.nonNullable.group({
    reading: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {}

  save() {
    this.readingService
      .create(this.client.id, this.FormReading.value.reading!)
      .subscribe((data) => {
        this.ref.close();
      });
  }
}
