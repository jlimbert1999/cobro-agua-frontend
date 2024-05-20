import { Routes } from '@angular/router';
import { ClientsComponent } from './presentation/pages/clients/clients.component';
import { HomeComponent } from './presentation/layouts/home/home.component';
import { SettingsComponent } from './presentation/pages/settings/settings.component';
import { LoginComponent } from './presentation/pages/login/login.component';
import { isAuthenticatedGuard } from './presentation/guards/is-authenticated.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    canActivate: [isAuthenticatedGuard],
    component: HomeComponent,
    children: [
      { path: 'customers', component: ClientsComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
];
