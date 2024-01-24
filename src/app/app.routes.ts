import { Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { ClientsComponent } from './consumer/screens/clients/clients.component';
import { ActionsComponent } from './consumer/screens/actions/actions.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'clients', component: ClientsComponent },
      { path: 'actions', component: ActionsComponent },
    ],
  },
];
