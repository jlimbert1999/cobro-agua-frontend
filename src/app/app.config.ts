import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-BO';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { PrimengModule } from './primeng.module';
import { loggingInterceptor } from './core/interceptor';
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
