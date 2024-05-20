import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { paymentResponse } from '../../infrastructure/interfaces';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { AuthService } from './auth.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor(private authService: AuthService) {}

  generateInvoice(payment: paymentResponse) {
    const total = payment.invoices.reduce((acc, prev) => acc + prev.amount, 0);
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'LETTER',
      content: [
        {
          columns: [
            {
              width: 100,
              text: '',
            },
            [
              {
                text: 'Recibo',
                alignment: 'right',
                style: 'invoiceTitle',
              },
              {
                text: new Date().toLocaleString(),
                alignment: 'right',
              },
            ],
          ],
        },
        {
          text: '\n\n AFILIADO:',
          style: 'sectionHeader',
        },
        {
          text: `${payment.customer.firstname} ${payment.customer?.middlename} ${payment.customer?.lastname}\nCI: ${payment.customer.dni}\nDireccion: ${payment.customer.address}`,
        },
        {
          text: '\n\n',
        },
        {
          table: {
            widths: ['*', 'auto', 'auto'],
            body: [
              [
                { text: 'Servicio', style: 'tableHeader' },
                { text: 'Fecha', style: 'tableHeader' },
                { text: 'Monto', style: 'tableHeader' },
              ],
              ...payment.invoices.map((el) => [
                'Servicio de agua',
                new Date(el.issue_date).toLocaleString(),
                `${el.amount} Bs.`,
              ]),
              [
                {
                  text: 'Total',
                  colSpan: 2,
                  alignment: 'right',
                  style: 'total',
                },
                {},
                { text: `${total} Bs. `, alignment: 'right', style: 'total' },
              ],
            ],
          },
          layout: 'lightHorizontalLines',
        },
        {
          text: '\n\nINFORMACION DEL PAGO',
          style: 'sectionHeader',
        },
        {
          text: `Pagado el: ${new Date(
            payment.payment_date
          ).toLocaleString()}\nTotal pagado: ${payment.amount} Bs.\n`,
        },
        {
          columns: [
            { width: '*', text: '' },
            {
              text: `Encargado: ${this.authService.user()?.fullname}`,
              alignment: 'right',
            },
          ],
        },
      ],
      styles: {
        invoiceTitle: {
          fontSize: 20,
          bold: true,
        },
        sectionHeader: {
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableHeader: {
          bold: true,
          fillColor: '#eeeeee',
        },
        total: {
          bold: true,
          fontSize: 14,
        },
        thanks: {
          fontSize: 14,
          italics: true,
        },
      },
    };

    pdfMake.createPdf(docDefinition).print({ autoPrint: true });
  }
}
