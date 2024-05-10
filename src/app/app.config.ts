import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { PrimengModule } from './primeng.module';
import { loggingInterceptor } from './interceptors/interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([loggingInterceptor])),
    provideRouter(routes),
    provideAnimations(),
    PrimengModule,
  ],
};
