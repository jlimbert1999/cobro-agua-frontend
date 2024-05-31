import { Routes } from '@angular/router';
import { ClientsComponent } from './presentation/pages/clients/clients.component';
import { HomeComponent } from './presentation/layouts/home/home.component';
import { SettingsComponent } from './presentation/pages/settings/settings.component';
import { LoginComponent } from './presentation/pages/login/login.component';
import { isAuthenticatedGuard } from './presentation/guards/is-authenticated.guard';
import { UsersComponent } from './presentation/pages/administration/users/users.component';
import { CustomerStatusComponent } from './presentation/pages/reports/customer-status/customer-status.component';

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
      { path: '', redirectTo: 'customers', pathMatch: 'full' },
      { path: 'customers', component: ClientsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'users', component: UsersComponent },
      {
        path: 'reports',
        children: [
          { path: 'customer-status', component: CustomerStatusComponent },
        ],
      },
    ],
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
