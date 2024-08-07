import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { TDocumentDefinitions } from 'pdfmake/interfaces';

import { paymentResponse } from '../../infrastructure/interfaces';
import { Client, Invoice, Payment } from '../../domain';
import { AuthService } from './auth.service';
import { PdfFormats } from '../../helpers';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor(private authService: AuthService) {}

  async generateInvoice(payment: Payment) {
    const username = this.authService.user()?.fullname ?? 'SIN USUARIO';
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'LETTER',
      pageMargins: [40, 120, 40, 40],
      header: await PdfFormats.header(),
      content: PdfFormats.invoiceSheet(payment, username),
    };

    pdfMake.createPdf(docDefinition).print({ autoPrint: true });
  }

  async generateDebtSheet(customer: Client, invoices: Invoice[]) {
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'LETTER',
      pageMargins: [40, 120, 40, 40],
      header: await PdfFormats.header(),
      content: PdfFormats.debtSheet(customer, invoices),
    };
    pdfMake.createPdf(docDefinition).open();
  }
}
