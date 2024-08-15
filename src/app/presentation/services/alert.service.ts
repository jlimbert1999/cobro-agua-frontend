import { Injectable, inject } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertComponent } from '../components';

interface alertConfig {
  header: string;
  description: string;
  width?: number;
  icon?: icons;
  closable?: boolean;
}

type icons = 'error' | 'warning' | 'success' | 'loading' | 'security';
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private dialogService = inject(DialogService);

  private loader = new BehaviorSubject<boolean>(false);
  loading$ = this.loader.asObservable();

  constructor() {}

  show({ header, width = 30, closable = true, ...props }: alertConfig) {
    return this.dialogService.open(AlertComponent, {
      header: header,
      data: props,
      width: `${width}vw`,
      closable: closable,
      breakpoints: {
        '960px': '90vw',
      },
    });
  }

  question(
    header: string,
    description: string,
    width: number = 30
  ): Observable<boolean> {
    const ref = this.dialogService.open(AlertComponent, {
      header: header,
      data: {
        description,
        confirmation: true,
      },
      width: `${width}vw`,
      closable: false,
      breakpoints: {
        '960px': '90vw',
      },
    });
    return ref.onClose;
  }

  appLoadingOn(): void {
    this.loader.next(true);
  }

  appLoadingOff() {
    this.loader.next(false);
  }
}
