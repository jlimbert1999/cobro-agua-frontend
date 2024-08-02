import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

import { paymentResponse } from '../../infrastructure/interfaces';
import { AuthService } from './auth.service';
import { convertImageToBase64 } from '../../helpers';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor(private authService: AuthService) {}

  async generateInvoice(payment: paymentResponse) {
    console.log(payment);
    const logo = await convertImageToBase64(
      '../../../assets/images/institution-logo.jpeg'
    );
    const total = payment.invoices.reduce((acc, prev) => acc + prev.amount, 0);
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'LETTER',
      pageMargins: [40, 120, 40, 40],
      header: {
        margin: [40, 20, 40, 20],
        columns: [
          {
            image: logo,
            width: 60,
            height: 70,
          },
          {
            width: '*',
            marginLeft: 10,
            text: [
              {
                text: 'ORGANIZACION TERRITORIAL DE BASE\n',
                fontSize: 10,
              },
              { text: 'CARCAJE CENTRAL\n', bold: true, fontSize: 12 },
              { text: 'Km. 19-22', fontSize: 11 },
            ],
          },
          {
            width: 150,
            alignment: 'center',
            text: [
              {
                text: 'RECIBO DE INGRESO\nAGUA POTABLE\n\n',
              },
              { text: new Date().toLocaleString(), bold: true },
            ],
          },
        ],
      },
      content: [
        {
          table: {
            headerRows: 1,
            widths: [100, '*'],
            body: [
              [{ text: 'DETALLE ACCIONISTA', bold: true, colSpan: 2 }, ''],
              ['Nombre', ''],
              ['Tipo', 'Sample value 2'],
              ['Nro. Medidor', 'Sample value 2'],
            ],
          },
          layout: 'noBorders',
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
                new Date(el.createdAt).toLocaleString(),
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
          text: `Pagado el: ${new Date(payment.createdAt).toLocaleString(
            'default',
            { month: 'long' }
          )}\nTotal pagado: ${payment.amount} Bs.\n`,
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
    };

    pdfMake.createPdf(docDefinition).print({ autoPrint: true });
  }
}
