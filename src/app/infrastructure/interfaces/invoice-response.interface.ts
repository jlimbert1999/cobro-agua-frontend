import { readingResponse } from './reading-response';

export interface invoiceResponse {
  id: number;
  amount: number;
  createdAt: string;
  status: string;
  customerId: string;
  paymentId: string | null;
  service: readingResponse;
}