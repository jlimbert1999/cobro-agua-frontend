import { invoiceResponse } from '../../infrastructure';
import { Reading } from './reading.model';

interface invoiceProps {
  id: number;
  amount: number;
  createdAt: Date;
  paymentId: string | null;
  service: Reading;
  discountDetails: discountProps | null;
}
interface discountProps {
  name: string;
  percentage: string;
  originalAmount: string;
  amount: string;
}

export class Invoice {
  id: number;
  amount: number;
  createdAt: Date;
  paymentId: string | null;
  service: Reading;
  discountDetails: discountProps | null;

  static fromResponse(response: invoiceResponse) {
    return new Invoice({
      id: response.id,
      amount: response.amount,
      createdAt: new Date(response.createdAt),
      paymentId: response.paymentId,
      service: Reading.fromResponse(response.service),
      discountDetails: response.discountDetails,
    });
  }

  constructor({
    id,
    amount,
    createdAt,
    paymentId,
    service,
    discountDetails,
  }: invoiceProps) {
    this.id = id;
    this.amount = amount;
    this.createdAt = createdAt;
    this.paymentId = paymentId;
    this.service = service;
    this.discountDetails = discountDetails;
  }

  get subtotal() {
    return this.discountDetails
      ? this.discountDetails.originalAmount
      : this.amount;
  }

  get discountTitle() {
    return this.discountDetails
      ? `${this.discountDetails.name} (${this.discountDetails.percentage} %)`
      : '-';
  }
}
