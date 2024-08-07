import { Content } from 'pdfmake/interfaces';
import { Client, Invoice, Payment } from '../domain';
import { convertImageToBase64 } from './convert-image-base64';
import { paymentResponse } from '../infrastructure/interfaces';

export class PdfFormats {
  static async header(): Promise<Content> {
    const logo = await convertImageToBase64('../../../assets/images/logo.jpeg');
    return {
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
              text: 'ORGANIZACION TERRITORIAL DE BASE\n\n',
              fontSize: 10,
            },
            { text: 'CARCAJE CENTRAL\n', bold: true, fontSize: 12 },
            { text: 'Km. 19-22', fontSize: 11 },
          ],
        },
        {
          width: 150,
          alignment: 'right',
          text: [{ text: new Date().toLocaleString(), bold: true }],
        },
      ],
    };
  }

  static invoiceSheet(payment: Payment, username: string): Content[] {
    const total = payment.invoices.reduce((acc, { amount }) => acc + amount, 0);
    return [
      {
        text: 'RECIBO DE INGRESO DE AGUA POTABLE\n\n',
        bold: true,
        fontSize: 16,
        alignment: 'center',
      },
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
            text: `Encargado: ${username}`,
            alignment: 'right',
          },
        ],
      },
    ];
  }

  static debtSheet(customer: Client, invoices: Invoice[]): Content[] {
    const total = invoices.reduce((acc, { amount }) => acc + amount, 0);
    invoices
      .sort((a, b) => a.service.year - b.service.year)
      .sort((a, b) => a.service.month - b.service.month);
    return [
      {
        text: 'LISTADO DE PAGOS PENDIENTES\n\n',
        bold: true,
        fontSize: 16,
        alignment: 'center',
      },
      {
        table: {
          headerRows: 1,
          widths: [100, '*'],
          body: [
            [{ text: 'DETALLE ACCIONISTA', bold: true, colSpan: 2 }, ''],
            ['Nombre', customer.fullname],
            ['Tipo', customer.type.name],
            ['Medidor', customer.meterNumber],
            ['Telefono', customer.phone],
          ],
        },
        layout: 'noBorders',
      },
      {
        text: '\n\nLECTURAS REALIZADAS\n\n',
        bold: true,
        alignment: 'center',
      },
      {
        table: {
          widths: ['*', 'auto', 'auto', '*', 'auto'],
          body: [
            [
              { text: 'Servicio', style: 'tableHeader' },
              { text: 'Lectura', style: 'tableHeader' },
              { text: 'Consumo', style: 'tableHeader' },
              { text: 'Fecha', style: 'tableHeader' },
              { text: 'Monto', style: 'tableHeader' },
            ],
            ...invoices.map((el) => [
              'Consumo de agua',
              el.service.reading,
              el.service.consumption,
              el.service.datetimeLabel,
              `${el.amount} Bs.`,
            ]),
            [
              {
                text: 'TOTAL',
                colSpan: 4,
                alignment: 'left',
                style: 'total',
                bold: true,
              },
              '',
              '',
              '',
              { text: `${total} Bs. `, bold: true },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
      },
    ];
  }
}
