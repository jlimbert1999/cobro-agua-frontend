import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  invoiceResponse,
  paymentResponse,
} from '../../infrastructure/interfaces';
import { Invoice } from '../../domain';


@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly url = `${environment.base_url}/invoices`;
  private http = inject(HttpClient);

  constructor() {}

  getUnpaidInvoicesByClient(id_client: string) {
    return this.http
      .get<invoiceResponse[]>(`${this.url}/unpaid/${id_client}`)
      .pipe(map((res) => res.map((el) => Invoice.fromResponse(el))));
  }

  payInvoices(id_client: string, invoiceIds: string[]) {
    return this.http.post<paymentResponse>(`${this.url}/pay/${id_client}`, {
      invoiceIds,
    });
  }
}
