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

  static async headerInvoice(): Promise<Content> {
    const logo = await convertImageToBase64('../../../assets/images/logo.jpeg');
    return {
      margin: [10, 10, 10, 0],
      columns: [
        {
          image: logo,
          width: 40,
          height: 50,
        },
        {
          width: '*',
          marginLeft: 10,
          text: [
            {
              text: 'ORGANIZACION TERRITORIAL DE BASE\n\n',
              fontSize: 8,
            },
            { text: 'CARCAJE CENTRAL\n', bold: true, fontSize: 9 },
            { text: 'Km. 19-22', fontSize: 8 },
          ],
        },
        {
          width: 150,
          alignment: 'right',
          text: [
            { text: new Date().toLocaleString(), bold: true, fontSize: 9 },
          ],
        },
      ],
    };
  }

  static invoiceSheet(payment: Payment, username: string): Content[] {
    const total = payment.invoices.reduce((acc, { amount }) => acc + amount, 0);
    return [
      {
        text: `Nro. Recibo: ${payment.code}`,
        bold: true,
        alignment: 'right',
        fontSize: 8,
      },
      {
        text: 'RECIBO DE INGRESO DE AGUA POTABLE\n',
        bold: true,
        fontSize: 10,
        alignment: 'center',
      },
      {
        fontSize: 7,
        table: {
          headerRows: 1,
          widths: [100, '*'],
          body: [
            [{ text: 'DETALLE ACCIONISTA', bold: true, colSpan: 2 }, ''],
            ['Nombre', payment.customer.fullname],
            ['Tipo', payment.customer.type.name],
            ['Nro. Medidor', payment.customer.meterNumber],
          ],
        },
        layout: 'noBorders',
      },
      {
        marginTop: 10,
        fontSize: 7,
        table: {
          widths: ['*', 'auto', 'auto', 'auto', 80, 'auto'],
          body: [
            [
              { text: 'Servicio', bold: true },
              { text: 'Mes', bold: true },
              { text: 'Consumo', bold: true },
              { text: 'Subtotal', bold: true },
              { text: 'Descuento (%)', bold: true },
              { text: 'Total', bold: true },
            ],
            ...payment.invoices.map((el) => [
              'Servicio de agua',
              el.service.datetimeLabel,
              el.service.consumption,
              `${el.subtotal} Bs.`,
              `${el.discountTitle}`,
              `${el.amount} Bs.`,
            ]),
            [
              {
                text: 'TOTAL A PAGAR',
                colSpan: 5,
                alignment: 'left',
                style: 'total',
              },
              '',
              '',
              '',
              '',
              { text: `${total} Bs. `, alignment: 'right', style: 'total' },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
      },
      {
        text: 'INFORMACION DEL PAGO',
        fontSize: 8,
        marginTop: 5,
      },
      {
        fontSize: 7,
        text: `Pagado el: ${payment.createdAt.toLocaleString()}\nTotal pagado: ${
          payment.amount
        } Bs.\n`,
      },
      {
        marginTop: 30,
        fontSize: 8,
        columns: [
          {
            width: '*',
            text: 'Recibi conforme',
            alignment: 'center',
          },
          {
            width: '*',
            text: `Entregue conforme`,
            alignment: 'center',
          },
        ],
      },
    ];
  }

  static debtSheet(customer: Client, invoices: Invoice[]): Content[] {
    const total = invoices.reduce((acc, { amount }) => acc + amount, 0);

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
        fontSize: 9,
        table: {
          widths: ['*', 'auto', 'auto', '*', 'auto', 120, 'auto'],
          body: [
            [
              { text: 'Servicio', style: 'tableHeader' },
              { text: 'Lectura', style: 'tableHeader' },
              { text: 'Consumo', style: 'tableHeader' },
              { text: 'Fecha', style: 'tableHeader' },
              { text: 'Subtotal', style: 'tableHeader' },
              { text: 'Descuento (%)', style: 'tableHeader' },
              { text: 'Total', style: 'tableHeader' },
            ],
            ...invoices.map((el) => [
              'Consumo de agua',
              el.service.reading,
              el.service.consumption,
              el.service.datetimeLabel,
              `${el.subtotal} Bs.`,
              el.discountTitle,
              `${el.amount} Bs.`,
            ]),
            [
              {
                text: 'TOTAL DEUDA:',
                colSpan: 6,
                alignment: 'left',
                style: 'total',
                bold: true,
              },
              '',
              '',
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
