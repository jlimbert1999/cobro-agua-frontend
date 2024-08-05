import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { AlertService, AuthService } from '../presentation/services';
import { handleHttpErrorMessage } from '../helpers';
import { MessageService } from 'primeng/api';

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const messageService = inject(MessageService);
  const alertService = inject(AlertService);
  const router = inject(Router);

  const reqWithHeader = req.clone({
    headers: req.headers.append(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    ),
  });
  alertService.appLoadingOn();
  return next(reqWithHeader).pipe(
    catchError((error) => {
      console.log(error);
      if (error instanceof HttpErrorResponse) {
        handleHttpErrorMessage({
          error,
          router,
          messageService,
          authService,
        });
      }
      return throwError(() => Error);
    }),
    finalize(() => {
      alertService.appLoadingOff()
    })
  );
}
