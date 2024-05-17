import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PrimengModule } from '../../../primeng.module';
import { ProfileComponent } from '../../components';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PrimengModule, ProfileComponent, RouterModule],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  items: MenuItem[] = [
    {
      label: 'Afiliados',
      icon: 'pi pi-fw pi-user',
      routerLink: 'clients',
    },
    {
      label: 'Configuracion',
      icon: 'pi pi-fw pi-cog',
      routerLink: 'settings',
    },
  ];
}
