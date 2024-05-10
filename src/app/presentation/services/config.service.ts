import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { configResponse } from '../../infrastructure/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private http = inject(HttpClient);
  private readonly url = `${environment.base_url}/config`;

  constructor() {}

  geSettings() {
    return this.http.get<configResponse>(this.url);
  }

  changeSettins(config: configResponse) {
    return this.http.post<configResponse>(this.url, config);
  }
}
