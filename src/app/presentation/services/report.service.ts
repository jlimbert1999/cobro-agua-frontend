import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { paymentResponse } from '../../infrastructure/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private http = inject(HttpClient);
  private readonly url = `${environment.base_url}/invoices`;
  constructor() {}

  getPayments(id_customer: number, limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<any[]>(`${this.url}/history/${id_customer}`, {
      params,
    });
  }

  getPaymentsByRange(startDate: Date, endDate: Date) {
    return this.http.get<paymentResponse[]>(
      `${environment.base_url}/reports/payments/range?start=${startDate}&end=${endDate}`
    );
  }
}
