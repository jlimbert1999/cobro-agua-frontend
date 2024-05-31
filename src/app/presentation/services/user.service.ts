import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { userResponse } from '../../infrastructure/interfaces';
import { CreateUserDto } from '../../infrastructure/dtos';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly url = `${environment.base_url}/users`;
  private http = inject(HttpClient);
  constructor() {}

  create(form: Object) {
    const user = CreateUserDto.fromForm(form);
    return this.http.post(this.url, user);
  }

  update(id: string, user: Partial<CreateUserDto>) {
    return this.http.patch(`${this.url}/${id}`, user);
  }

  findAll(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{ users: userResponse[]; length: number }>(this.url, {
      params,
    });
  }
  
  search(term: string, limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{ users: userResponse[]; length: number }>(
      `${this.url}/search/${term}`,
      { params }
    );
  }
}
