import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { readingResponse } from '../../infrastructure/interfaces';
import { customerTypeResponse } from '../../infrastructure';

interface uploadData {
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  phone: string;
  meterNumber: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReadingService {
  private http = inject(HttpClient);
  private readonly url = `${environment.base_url}/readings`;
  constructor() {}

  getPreviusReading(id_customer: string) {
    return this.http.get<readingResponse | null>(
      `${this.url}/previus/${id_customer}`
    );
  }

  getReadingsByCustomer(id_customer: string, limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{ readings: readingResponse[]; length: number }>(
      `${this.url}/${id_customer}`,
      { params }
    );
  }

  create(customerId: string, reading: number) {
    return this.http.post<{ message: string }>(this.url, {
      customerId,
      reading,
    });
  }

  getCustomerType(typeId: number) {
    return this.http.get<customerTypeResponse>(
      `${this.url}/customer-type/${typeId}`
    );
  }
}
