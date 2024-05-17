import { HttpClient } from '@angular/common/http';
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

  getDebts(id_client: string) {
    return this.http.get<readingResponse[]>(`${this.url}/debts/${id_client}`);
  }

  create(id_client: string, reading: number) {
    return this.http.post<readingResponse>(this.url, {
      client: id_client,
      reading,
    });
  }
}
