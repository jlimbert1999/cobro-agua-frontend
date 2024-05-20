import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Client } from '../../../../domain/models';
import { readingResponse } from '../../../../infrastructure/interfaces';
import { ReadingService } from '../../../services';
import { PrimengModule } from '../../../../primeng.module';

@Component({
  selector: 'app-detail-reading',
  standalone: true,
  imports: [CommonModule, PrimengModule],
  templateUrl: './detail-reading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailReadingComponent implements OnInit {
  private readingService = inject(ReadingService);

  client: Client = inject(DynamicDialogConfig).data;
  readings = signal<readingResponse[]>([]);

  ngOnInit(): void {
    this._getReadings();
  }

  private _getReadings() {
    this.readingService
      .getReadingsByCustomer(this.client.id, 10, 0)
      .subscribe((readings) => {
        this.readings.set(readings);
      });
  }
}
