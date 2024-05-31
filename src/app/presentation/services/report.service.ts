import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private http = inject(HttpClient);
  private readonly url = `${environment.base_url}/invoices`;
  constructor() {}

  getPayments(id_customer: string, limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<any[]>(`${this.url}/history/${id_customer}`, {
      params,
    });
  }
}
