import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PrimengModule } from '../../../primeng.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PrimengModule],
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
