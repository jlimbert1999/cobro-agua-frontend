import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ReadingService } from '../../../services';
import { PrimengModule } from '../../../../primeng.module';
import { PageProps, PaginatorComponent } from '../../../components';
import { Client, Reading } from '../../../../domain';

@Component({
  selector: 'app-metric-records',
  standalone: true,
  imports: [CommonModule, PrimengModule, PaginatorComponent],
  templateUrl: './metric-records.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricRecordsComponent implements OnInit {
  private readingService = inject(ReadingService);

  client: Client = inject(DynamicDialogConfig).data;
  readings = signal<Reading[]>([]);
  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  datasize = signal(0);

  ngOnInit(): void {
    this._getReadings();
  }

  private _getReadings() {
    this.readingService
      .getReadingsByCustomer(this.client.id, this.limit(), this.offset())
      .subscribe(({ readings, length }) => {
        this.readings.set(readings);
        this.datasize.set(length);
      });
  }

  onPageChange(event: PageProps) {
    this.limit.set(event.pageSize);
    this.index.set(event.pageIndex);
    this._getReadings();
  }
}
