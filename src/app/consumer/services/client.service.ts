import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { action, client } from '../interfaces';
import { map } from 'rxjs';
import { Client } from '../models';
import { CreateClientDto } from '../dtos';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly url = `${environment.base_url}`;
  constructor(private http: HttpClient) {}

  searchAvilableActions(term: string) {
    return this.http.get<action[]>(`${this.url}/actions/availables/${term}`);
  }

  getActions() {
    return this.http.get<action[]>(`${this.url}/actions/`);
  }

  addAction(form: Object) {
    return this.http.post<action>(`${this.url}/actions`, form);
  }

  editAction(id: string, form: any) {
    return this.http.patch<action>(`${this.url}/actions/${id}`, form);
  }

  getClients() {
    return this.http
      .get<client[]>(`${this.url}/clients`)
      .pipe(map((resp) => resp.map((el) => Client.responseToModel(el))));
  }

  addClient(form: Object) {
    const client = CreateClientDto.fromFormGroup(form);
    return this.http
      .post<client>(`${this.url}/clients`, client)
      .pipe(map((resp) => Client.responseToModel(resp)));
  }

  editClient(id: string, form: Object) {
    return this.http
      .patch<client>(`${this.url}/clients/${id}`, form)
      .pipe(map((resp) => Client.responseToModel(resp)));
  }
}
