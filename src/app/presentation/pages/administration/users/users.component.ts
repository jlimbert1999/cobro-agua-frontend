import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { PrimengModule } from '../../../../primeng.module';
import { UserService } from '../../../services';
import { userResponse } from '../../../../infrastructure/interfaces';
import { DialogService } from 'primeng/dynamicdialog';
import { UserComponent } from './user/user.component';
import { filter } from 'rxjs';
import { PageProps } from '../../../components';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, PrimengModule],
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class UsersComponent implements OnInit {
  private dialogService = inject(DialogService);
  private userService = inject(UserService);

  datasource = signal<userResponse[]>([]);
  datasize = signal(0);
  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  term = signal<string>('');

  items = [
    {
      label: 'Update',
      icon: 'pi pi-refresh',
    },
    {
      label: 'Delete',
      icon: 'pi pi-times',
    },
  ];

  ngOnInit(): void {
    this._getUsers();
  }

  private _getUsers() {
    const subscription = this.term()
      ? this.userService.search(this.term(), this.limit(), this.offset())
      : this.userService.findAll(this.limit(), this.offset());
    subscription.subscribe(({ users, length }) => {
      this.datasource.set(users);
      this.datasize.set(length);
    });
  }

  create() {
    const ref = this.dialogService.open(UserComponent, {
      header: 'Crear Usuario',
      width: '30rem',
    });
    ref.onClose
      .pipe(filter((result: userResponse) => !!result))
      .subscribe((customer) => {
        this.datasource.update((values) => {
          this.datasize.update((val) => (val += 1));
          if (this.limit() === values.length) {
            values.pop();
          }
          return [customer, ...values];
        });
      });
  }

  update(user: userResponse) {
    const ref = this.dialogService.open(UserComponent, {
      header: 'Editar Usuario',
      width: '30rem',
      data: user,
    });
    ref.onClose
      .pipe(filter((result?: userResponse) => !!result))
      .subscribe((result) => {
        this.datasource.update((values) => {
          const index = values.findIndex((el) => el._id === user._id);
          values[index] = result!;
          return [...values];
        });
      });
  }

  onSearch(value: string) {
    this.term.set(value);
    this._getUsers();
  }

  onPageChange(event: PageProps) {
    this.limit.set(event.pageSize);
    this.index.set(event.pageIndex);
    this._getUsers();
  }
}
