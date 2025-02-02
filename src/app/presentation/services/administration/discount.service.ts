import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DiscountService {
  private http = inject(HttpClient);
  private readonly url = `${environment.base_url}/discount`;

  findAll(limit: number, offset: number, term?: string) {
    const params = new HttpParams({
      fromObject: { limit, offset, ...(term && { term }) },
    });
    return this.http.get<{ discounts: any[]; length: number }>(this.url, {
      params,
    });
  }

  create(form: object) {
    return this.http.post(this.url, form);
  }

  update(id: number, form: object) {
    return this.http.patch(`${this.url}/${id}`, form);
  }
}
