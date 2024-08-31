import { Routes } from '@angular/router';
import { ClientsComponent } from './presentation/pages/clients/clients.component';
import { HomeComponent } from './presentation/layouts/home/home.component';
import { LoginComponent } from './presentation/pages/login/login.component';
import { isAuthenticatedGuard } from './presentation/guards/is-authenticated.guard';
import { UsersComponent } from './presentation/pages/administration/users/users.component';
import { CustomerStatusComponent } from './presentation/pages/reports/customer-status/customer-status.component';
import { CustomerTypesComponent } from './presentation/pages/administration/customer-types/customer-types.component';
import { MeterComponent } from './presentation/pages/meter/meter.component';
import { BackgroudComponent } from './presentation/pages/backgroud/backgroud.component';
import { roleGuard } from './presentation/guards/role.guard';
import { ReportPaymentRangeComponent } from './presentation/pages/reports/report-payment-range/report-payment-range.component';

export const routes: Routes = [
  {
    title: 'Inicio de Sesion',
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    title: 'Inicio',
    canActivate: [isAuthenticatedGuard],
    component: HomeComponent,
    children: [
      { path: '', component: BackgroudComponent },
      {
        data: { role: 'officer' },
        canActivate: [roleGuard],
        title: 'Panel',
        path: 'customers',
        component: ClientsComponent,
      },
      {
        data: { role: 'admin' },
        canActivate: [roleGuard],
        title: 'Administracion',
        path: 'administration',
        children: [
          { title: 'Accionistas', path: 'users', component: UsersComponent },
          {
            title: 'Tipos',
            path: 'customer-types',
            component: CustomerTypesComponent,
          },
        ],
      },
      {
        data: { role: 'reader' },
        canActivate: [roleGuard],
        title: 'Lecturas',
        path: 'reading',
        component: MeterComponent,
      },
      {
        title: 'Reportes',
        path: 'reports',
        children: [
          { path: 'customer-status', component: CustomerStatusComponent },
          { path: 'payments-rage', component: ReportPaymentRangeComponent },
        ],
      },
    ],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];
