import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  invoiceResponse,
  paymentResponse,
} from '../../infrastructure/interfaces';
import { Invoice, Payment } from '../../domain';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly url = `${environment.base_url}/invoices`;
  private http = inject(HttpClient);

  constructor() {}

  getUnpaidInvoicesByClient(id_client: number) {
    return this.http
      .get<invoiceResponse[]>(`${this.url}/unpaid/${id_client}`)
      .pipe(map((res) => res.map((el) => Invoice.fromResponse(el))));
  }

  payInvoices(customerId: number, invoiceIds: number[]) {
    return this.http
      .post<paymentResponse>(`${this.url}/pay/${customerId}`, {
        invoiceIds,
      })
      .pipe(map((resp) => Payment.fromResponse(resp)));
  }

  getHistoryByCustomer(customerId: number, limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<paymentResponse[]>(`${this.url}/history/${customerId}`, { params })
      .pipe(map((resp) => resp.map((el) => Payment.fromResponse(el))));
  }
}
