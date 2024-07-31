import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { clientResponse } from '../../infrastructure/interfaces';
import { CreateClientDto } from '../../infrastructure/dtos';
import { Client } from '../../domain/models';
import { customerTypeResponse } from '../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly url = `${environment.base_url}/clients`;
  private http = inject(HttpClient);

  constructor() {}

  findAll(limit: number, offset: number, filterParams: Object) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .post<{ clients: clientResponse[]; length: number }>(
        `${this.url}/filter`,
        filterParams,
        { params }
      )
      .pipe(
        map(({ length, clients }) => ({
          clients: clients.map((el) => Client.fromResponse(el)),
          length: length,
        }))
      );
  }

  create(form: Object) {
    const branchDto = CreateClientDto.fromForm(form);
    return this.http
      .post<clientResponse>(`${this.url}`, branchDto)
      .pipe(map((resp) => Client.fromResponse(resp)));
  }

  update(id: string, form: Partial<CreateClientDto>) {
    return this.http
      .patch<clientResponse>(`${this.url}/${id}`, form)
      .pipe(map((resp) => Client.fromResponse(resp)));
  }

  upload(data: any[]) {
    return this.http.post(`${this.url}/upload`, data);
  }

  searchByMeterNumber(term: string) {
    return this.http
      .get<clientResponse[]>(`${this.url}/meter/${term}`)

      .pipe(
        map((resp) => resp.map((el) => Client.fromResponse(el)))
      );
  }

  getCustomerTypes() {
    return this.http.get<customerTypeResponse[]>(`${this.url}/types`);
  }
}
