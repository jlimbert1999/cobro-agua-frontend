import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import localeEs from '@angular/common/locales/es-BO';

import { routes } from './app.routes';
import { PrimengModule } from './primeng.module';
import { loggingInterceptor } from './interceptors/interceptor.service';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([loggingInterceptor])),
    provideRouter(routes),
    provideAnimations(),
    PrimengModule,
    { provide: LOCALE_ID, useValue: 'es' },
  ],
};
