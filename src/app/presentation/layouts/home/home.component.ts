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
      label: 'Administracion',
      icon: 'pi pi-fw pi-cog',
      items: [
        {
          label: 'Afiliados',
          icon: 'pi pi-fw pi-users',
          routerLink: 'clients',
        },
        {
          label: 'Acciones',
          icon: 'pi pi-fw pi-users',
          routerLink: 'actions',
        },
        {
          label: 'Configuraciones',
          icon: 'pi pi-fw pi-cog',
        },
      ],
    },
    {
      label: 'Lecturas',
      icon: 'pi pi-fw pi-bars',
    },
  ];
}
