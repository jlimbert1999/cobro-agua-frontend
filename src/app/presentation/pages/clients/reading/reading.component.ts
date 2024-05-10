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

interface lastConsume {
  consume: number;
  date: string;
}
@Component({
  selector: 'app-reading',
  standalone: true,
  imports: [CommonModule, PrimengModule, ReactiveFormsModule],
  templateUrl: './reading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadingComponent implements OnInit {
  private ref = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);

  private readingService = inject(ReadingService);
  private configService = inject(ConfigService);
  private client: Client = inject(DynamicDialogConfig).data;

  lastConsume = signal<lastConsume>({ consume: 0, date: '' });

  FormReading = this.fb.group({
    consume: ['', Validators.required],
    consumptionDate: [new Date(), Validators.required],
  });

  ngOnInit(): void {
    this.readingService.getLastReading(this.client.id).subscribe((data) => {
      if (data) {
        this.lastConsume.set({
          consume: data.consume,
          date: data.consumptionDate,
        });
      }
    });
  }

  save() {
    this.readingService
      .create(this.client.id, this.FormReading.value)
      .subscribe((data) => {
        this.ref.close();
      });
  }
}
