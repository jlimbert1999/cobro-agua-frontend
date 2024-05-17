import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CreateUserDto } from '../../infrastructure/dtos';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly url = `${environment}/users`;
  private http = inject(HttpClient);
  constructor() {}

  create(form: Object, services: string[]) {
    const readingDto = CreateUserDto.fromForm(form, services);
    return this.http.post(this.url, readingDto);
  }

  // indAll(limit: number, offset: number) {
  //   const params = new HttpParams({ fromObject: { limit, offset } });
  //   return this.http
  //     .get<{ clients: clientResponse[]; length: number }>(this.url, { params })
  //     .pipe(
  //       map(({ length, clients }) => ({
  //         clients: clients.map((el) => Client.fromResponse(el)),
  //         length: length,
  //       }))
  //     );
  // }
}
