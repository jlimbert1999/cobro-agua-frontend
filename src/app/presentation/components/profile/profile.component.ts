import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PrimengModule } from '../../../primeng.module';
import { AuthService } from '../../services';

@Component({
  selector: 'profile',
  standalone: true,
  imports: [CommonModule, PrimengModule],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  avatarLabel = this.authService.user()?.fullname[0];

  username = this.authService.user()?.fullname ?? 'Sin nombre';
  items: MenuItem[] = [
    { separator: true },
    {
      label: 'Cerrar sesion',
      icon: 'pi pi-sign-out',
      command: () => {
        this.logout();
      },
    },
  ];

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
