import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerTypeService {
  private http = inject(HttpClient);
  private readonly url = `${environment.base_url}/customer-type`;

  findAll(limit: number, offset: number, term?: string) {
    const params = new HttpParams({
      fromObject: { limit, offset, ...(term && { term }) },
    });
    return this.http.get<{ customerTypes: any[]; length: number }>(this.url, {
      params,
    });
  }

  create(form: any) {
    return this.http.post(this.url, form);
  }

  update(id: number, form: any) {
    return this.http.patch(`${this.url}/${id}`, form);
  }
}
