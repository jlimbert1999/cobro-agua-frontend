import { paymentResponse } from '../../infrastructure/interfaces';
import { Client } from './client.model';
import { Invoice } from './invoice.model';

interface paymentProps {
  id: number;
  code: string;
  amount: number;
  customer: Client;
  invoices: Invoice[];
  createdAt: Date;
}

export class Payment {
  id: number;
  code: string;
  amount: number;
  customer: Client;
  invoices: Invoice[];
  createdAt: Date;

  static fromResponse(response: paymentResponse) {
    return new Payment({
      id: response.id,
      code: response.code,
      amount: response.amount,
      customer: Client.fromResponse(response.customer),
      invoices: response.invoices.map((el) => Invoice.fromResponse(el)),
      createdAt: new Date(response.createdAt),
    });
  }
  constructor({
    id,
    code,
    amount,
    customer,
    invoices,
    createdAt,
  }: paymentProps) {
    this.id = id;
    this.code = code;
    this.amount = amount;
    this.customer = customer;
    this.invoices = invoices;
    this.createdAt = createdAt;
  }
}
