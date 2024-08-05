import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PrimengModule } from '../../../primeng.module';
import { ProfileComponent } from '../../components';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services';
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule,
    ProfileComponent,
    RouterModule,
    LoaderComponent,
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  menu = this.authService.menu();
  items: MenuItem[] = [];

  ngOnInit(): void {
    this.builMenu();
  }

  builMenu() {
    this.items = this.menu;
  }
}
