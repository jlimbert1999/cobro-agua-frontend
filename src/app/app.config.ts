import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-BO';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { PrimengModule } from './primeng.module';
import { loggingInterceptor } from './core/interceptor';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([loggingInterceptor])),
    provideAnimations(),
    PrimengModule,
    MessageService,
    DialogService,
    { provide: LOCALE_ID, useValue: 'es' },
  ],
};
