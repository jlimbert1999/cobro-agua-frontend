import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { PrimengModule } from '../../../../primeng.module';
import { ClientService, PdfService, ReportService } from '../../../services';
import { Client } from '../../../../domain/models';

@Component({
  selector: 'app-customer-status',
  standalone: true,
  imports: [CommonModule, PrimengModule],
  templateUrl: './customer-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerStatusComponent {
  private clientService = inject(ClientService);
  private reportService = inject(ReportService);
  private pdfService = inject(PdfService);

  customers = signal<Client[]>([]);
  term = signal<string>('');
  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  payments = signal<any[]>([]);

  searchCustomer(value: string) {
    if (value === '') return;
    this.clientService.search(value, 5, 0).subscribe(({ clients }) => {
      this.customers.set(clients);
    });
  }

  selectCustomer(client: Client) {
    this.reportService
      .getPayments(client.id, this.limit(), this.offset())
      .subscribe((resp) => {
        this.payments.set(resp);
      });
  }

  generatePdf(payment: any) {
    this.pdfService.generateInvoice(payment);
  }
}
