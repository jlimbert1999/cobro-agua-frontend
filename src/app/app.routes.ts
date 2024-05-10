import { Routes } from '@angular/router';
import { ClientsComponent } from './presentation/pages/clients/clients.component';
import { HomeComponent } from './presentation/layouts/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'clients', component: ClientsComponent },
    ],
  },
];
