import { Routes } from '@angular/router';
import { ClientsComponent } from './presentation/pages/clients/clients.component';
import { HomeComponent } from './presentation/layouts/home/home.component';
import { SettingsComponent } from './presentation/pages/settings/settings.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'clients', component: ClientsComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
];
