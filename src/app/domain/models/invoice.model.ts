import { invoiceResponse } from '../../infrastructure';
import { Reading } from './reading.model';

interface invoiceProps {
  id: number;
  amount: number;
  createdAt: Date;
  paymentId: string | null;
  service: Reading;
}

export class Invoice {
  id: number;
  amount: number;
  createdAt: Date;
  paymentId: string | null;
  service: Reading;

  static fromResponse(response: invoiceResponse) {
    return new Invoice({
      id: response.id,
      amount: response.amount,
      createdAt: new Date(response.createdAt),
      paymentId: response.paymentId,
      service: Reading.fromResponse(response.service),
    });
  }

  constructor({ id, amount, createdAt, paymentId, service }: invoiceProps) {
    this.id = id;
    this.amount = amount;
    this.createdAt = createdAt;
    this.paymentId = paymentId;
    this.service = service;
  }
}
