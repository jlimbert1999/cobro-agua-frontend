import { clientResponse } from './client-response';
import { invoiceResponse } from './invoiceResponse';

export interface paymentResponse {
  id: string;
  code: string;
  amount: number;
  customer: clientResponse;
  invoices: invoiceResponse[];
  createdAt: Date;
}
