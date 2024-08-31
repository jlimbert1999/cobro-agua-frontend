import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { ReportService } from '../../../services';
import { FormsModule } from '@angular/forms';
import { paymentResponse } from '../../../../infrastructure/interfaces';
@Component({
  selector: 'app-report-payment-range',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule, TableModule],
  templateUrl: './report-payment-range.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportPaymentRangeComponent {
  private reportService = inject(ReportService);
  startDate?: Date;
  endDate: Date = new Date();

  payments = signal<paymentResponse[]>([]);
  total = computed(() =>
    this.payments().reduce((previus, current) => (previus += current.amount), 0)
  );

  onSearch() {
    if (!this.startDate || !this.endDate) return;
    this.reportService
      .getPaymentsByRange(this.startDate, this.endDate)
      .subscribe((data) => {
        console.log(data);
        this.payments.set(data);
      });
  }
}
