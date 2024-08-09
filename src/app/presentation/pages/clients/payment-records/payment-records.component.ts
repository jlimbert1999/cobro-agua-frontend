import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { Client, Payment } from '../../../../domain';
import { PaymentService, PdfService } from '../../../services';
import { PageProps, PaginatorComponent } from '../../../components';

@Component({
  selector: 'app-payment-records',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, PaginatorComponent],
  templateUrl: './payment-records.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentRecordsComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private pdfService = inject(PdfService);

  client: Client = inject(DynamicDialogConfig).data;
  payments = signal<Payment[]>([]);
  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  datasize = signal(0);

  ngOnInit(): void {
    this.getPayments();
  }

  getPayments() {
    this.paymentService
      .getHistoryByCustomer(this.client.id, this.limit(), this.offset())
      .subscribe((payments) => {
        this.payments.set(payments);
      });
  }

  onPageChange(event: PageProps) {
    this.limit.set(event.pageSize);
    this.index.set(event.pageIndex);
    this.getPayments();
  }

  generateInvoice(payment: Payment) {
    this.pdfService.generateInvoice(payment);
  }
}
