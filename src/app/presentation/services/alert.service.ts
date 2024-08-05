import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private loader = new BehaviorSubject<boolean>(false);
  loading$ = this.loader.asObservable();

  constructor() {}

  appLoadingOn(): void {
    this.loader.next(true);
  }

  appLoadingOff() {
    this.loader.next(false);
  }
}
