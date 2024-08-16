import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ClientService, PdfService, ReportService } from '../../../services';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Client } from '../../../../domain';

@Component({
  selector: 'app-customer-status',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    PanelModule,
    ButtonModule,
    FormsModule,
  ],
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

  customer: any;

  searchCustomer(value: string) {
    if (value === '') return;
    this.clientService.searchByMeterNumber(value).subscribe((data) => {
      this.customers.set([...data]);
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
