import { clientResponse } from './client-response';
import { invoiceResponse } from './invoiceResponse';

export interface paymentResponse {
  _id: string;
  code: string;
  customer: clientResponse;
  invoices: invoiceResponse[];
  amount: number;
  payment_date: Date;
}
