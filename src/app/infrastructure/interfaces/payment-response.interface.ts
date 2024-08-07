import { clientResponse } from './client-response';
import { invoiceResponse } from './invoice-response.interface';

export interface paymentResponse {
  id: number;
  code: string;
  amount: number;
  customer: clientResponse;
  invoices: invoiceResponse[];
  createdAt: string;
}
