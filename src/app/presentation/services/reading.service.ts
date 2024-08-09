import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { readingResponse } from '../../infrastructure/interfaces';
import { map, tap } from 'rxjs';
import { Reading } from '../../domain';

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

  getLastReading(customerId: number) {
    return this.http
      .get<readingResponse | null>(`${this.url}/previus/${customerId}`)
      .pipe(map((resp) => (resp ? Reading.fromResponse(resp) : null)));
  }

  getReadingsByCustomer(id_customer: number, limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<{ readings: readingResponse[]; length: number }>(
        `${this.url}/${id_customer}`,
        { params }
      )
      .pipe(
        tap((el) => console.log(el)),
        map((resp) => ({
          readings: resp.readings.map((el) => Reading.fromResponse(el)),
          length: resp.length,
        }))
      );
  }

  create(customerId: number, reading: number) {
    return this.http.post<{ message: string }>(this.url, {
      customerId,
      reading,
    });
  }
}
