import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { readingResponse } from '../../infrastructure/interfaces';
import { CreateReadingDto } from '../../infrastructure/dtos';

@Injectable({
  providedIn: 'root',
})
export class ReadingService {
  private http = inject(HttpClient);
  private readonly url = `${environment.base_url}/readings`;
  constructor() {}

  getPreviusReading(id_client: string) {
    return this.http.get<readingResponse | null>(
      `${this.url}/last/${id_client}`
    );
  }

  getReadingsByCustomer(id_customer: string, limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<readingResponse[]>(`${this.url}/${id_customer}`, {
      params,
    });
  }

  create(id_client: string, reading: number) {
    return this.http.post<{ message: string }>(this.url, {
      client: id_client,
      reading,
    });
  }
}
