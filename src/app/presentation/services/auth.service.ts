import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { JwtPayload, menu } from '../../infrastructure/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly url = `${environment.base_url}/auth`;
  private http = inject(HttpClient);

  private _user = signal<JwtPayload | null>(null);
  private _menu = signal<menu[]>([]);
  private _roles = signal<string[]>([]);

  user = computed(() => this._user());
  menu = computed(() => this._menu());
  roles = computed(() => this._roles());

  constructor() {}

  login(login: string, password: string) {
    return this.http
      .post<{ token: string; redirectTo: string }>(this.url, {
        login,
        password,
      })
      .pipe(
        map(({ token, redirectTo }) => {
          this._setAuthentication(token);
          return redirectTo;
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this._user.set(null);
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }
    return this.http
      .get<{
        token: string;
        menu: menu[];
        roles: string[];
      }>(this.url)
      .pipe(
        map(({ token, menu, roles }) => {
          this._menu.set(menu);
          this._roles.set(roles);
          return this._setAuthentication(token);
        }),
        catchError(() => {
          return of(false);
        })
      );
  }

  private _setAuthentication(token: string): boolean {
    this._user.set(jwtDecode(token));
    localStorage.setItem('token', token);
    return true;
  }
}
