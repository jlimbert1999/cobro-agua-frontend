import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimengModule } from '../../../../primeng.module';
import { Client } from '../../../../domain/models';
import { PaymentService, PdfService } from '../../../services';
import { invoiceResponse } from '../../../../infrastructure/interfaces';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimengModule],
  templateUrl: './payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private pdfService = inject(PdfService);
  private ref = inject(DynamicDialogRef);

  client: Client = inject(DynamicDialogConfig).data;
  invoices = signal<invoiceResponse[]>([]);
  selectedInvoices = signal<invoiceResponse[]>([]);

  amountToPay = computed(() =>
    this.selectedInvoices().reduce((acc, { amount }) => acc + amount, 0)
  );

  ngOnInit(): void {
    this._getUnpaidInvoicesByCustomer();
  }

  addInvoice(invoice: invoiceResponse) {
    this.invoices.update((values) =>
      values.filter(({ id }) => id !== invoice.id)
    );
    this.selectedInvoices.update((values) => [...values, invoice]);
  }

  removeInvoice(invoice: invoiceResponse) {
    this.selectedInvoices.update((values) =>
      values.filter(({ id }) => id !== invoice.id)
    );
    this.invoices.update((values) => [invoice, ...values]);
  }

  save() {
    const id_invoices = this.selectedInvoices().map((el) => el.id);
    this.paymentService
      .payInvoices(this.client.id, id_invoices)
      .subscribe((resp) => {
        this.pdfService.generateInvoice(resp);
        this.ref.close();
      });
  }

  get isValidForm() {
    return this.selectedInvoices().length > 0;
  }

  private _getUnpaidInvoicesByCustomer() {
    this.paymentService
      .getUnpaidInvoicesByClient(this.client.id)
      .subscribe((data) => {
        this.invoices.set(data);
      });
  }
}
