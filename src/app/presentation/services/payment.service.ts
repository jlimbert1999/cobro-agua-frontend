import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { paymentResponse } from '../../infrastructure/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly url = `${environment.base_url}/invoices`;
  private http = inject(HttpClient);

  constructor() {}

  getUnpaidInvoicesByClient(id_client: string) {
    return this.http.get<any[]>(`${this.url}/unpaid/${id_client}`);
  }

  payInvoices(id_client: string, invoiceIds: string[]) {
    return this.http.post<paymentResponse>(`${this.url}/pay/${id_client}`, {
      invoiceIds,
    });
  }
}
