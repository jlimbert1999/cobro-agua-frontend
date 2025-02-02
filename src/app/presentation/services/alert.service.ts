import { Injectable, inject } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertComponent, AppLoaderComponent } from '../components';

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
  private loadingDialogRef?: DynamicDialogRef<AppLoaderComponent>;

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
    this.loadingDialogRef = this.dialogService.open(AppLoaderComponent, {
      header: 'Guardando',
      width: `300px`,
      closable: false,
      closeOnEscape: false,
      focusOnShow: false,
      breakpoints: {
        '960px': '90vw',
      },
    });
  }

  appLoadingOff() {
    this.loadingDialogRef?.close();
  }

  showGetLoading() {
    this.loader.next(true);
  }

  closeGetLoading() {
    this.loader.next(false);
  }
}
