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

  getLastReading(id_client: string) {
    return this.http.get<readingResponse | null>(
      `${this.url}/last/${id_client}`
    );
  }

  getDebts(id_client: string) {
    return this.http.get<readingResponse[]>(`${this.url}/debts/${id_client}`);
  }

  create(id_client: string, form: Object) {
    const readingDto = CreateReadingDto.fromForm({
      ...form,
      client: id_client,
    });
    return this.http.post<readingResponse>(this.url, readingDto);
  }
}
