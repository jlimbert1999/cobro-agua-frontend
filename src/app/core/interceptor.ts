import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../presentation/services';
import { handleHttpErrorMessage } from '../helpers';
import { MessageService } from 'primeng/api';

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const messageService = inject(MessageService);
  const router = inject(Router);

  const reqWithHeader = req.clone({
    headers: req.headers.append(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    ),
  });
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
    })
  );
}
