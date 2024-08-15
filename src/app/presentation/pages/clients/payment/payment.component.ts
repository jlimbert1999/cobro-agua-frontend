import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimengModule } from '../../../../primeng.module';
import { Client, Invoice } from '../../../../domain';
import { AlertService, PaymentService, PdfService } from '../../../services';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PrimengModule],
  templateUrl: './payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private alertService = inject(AlertService);
  private pdfService = inject(PdfService);
  private dialigRef = inject(DynamicDialogRef);

  client: Client = inject(DynamicDialogConfig).data;
  invoices = signal<Invoice[]>([]);
  selectedInvoices = signal<Invoice[]>([]);

  amountToPay = computed(() =>
    this.selectedInvoices().reduce((acc, { amount }) => acc + amount, 0)
  );

  ngOnInit(): void {
    this._getUnpaidInvoicesByCustomer();
  }

  save() {
    this.alertService
      .question(
        'Confirmar Pago',
        `Total de facturas a cancelar: ${this.selectedInvoices().length}`
      )
      .subscribe((confirm) => {
        if (!confirm) return;

        const id_invoices = this.selectedInvoices().map((el) => el.id);
        this.paymentService
          .payInvoices(this.client.id, id_invoices)
          .subscribe((resp) => {
            this.pdfService.generateInvoice(resp);
            this.dialigRef.close();
          });
      });
  }

  export() {
    this.pdfService.generateDebtSheet(this.client, this.invoices());
  }

  private _getUnpaidInvoicesByCustomer(): void {
    this.paymentService
      .getUnpaidInvoicesByClient(this.client.id)
      .subscribe((data) => {
        this.invoices.set(data);
      });
  }

  get isValidForm() {
    return this.selectedInvoices().length > 0;
  }
}
