import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PrimengModule } from '../../../primeng.module';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'profile',
  standalone: true,
  imports: [CommonModule, PrimengModule],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  items: MenuItem[] = [
    {
      label: 'Configuraciones',
      icon: 'pi pi-cog',
      route: '/guides/csslayer',
    },
    { separator: true },
    {
      label: 'Cerrar sesion',
      icon: 'pi pi-sign-out',
    },
  ];
}
