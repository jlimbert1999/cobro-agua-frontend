import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { filter } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { PrimengModule } from '../../../primeng.module';
import { ClientComponent } from './client/client.component';
import { Client } from '../../../domain/models/client.model';
import { ClientService } from '../../services';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, PrimengModule],
  templateUrl: `./clients.component.html`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class ClientsComponent implements OnInit {
  private dialogService = inject(DialogService);

  clients = signal<Client[]>([]);
  clientService = inject(ClientService);

  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  length = signal(0);

  ngOnInit(): void {
    this.clientService
      .findAll(this.limit(), this.offset())
      .subscribe(({ length, clients }) => {
        this.clients.set(clients);
        this.length.set(length);
      });
  }

  create() {
    const ref = this.dialogService.open(ClientComponent, {
      header: 'Crear Afiliado',
      width: '50rem',
    });
    ref.onClose
      .pipe(filter((result?: Client) => !!result))
      .subscribe((category) => {
        this.clients.update((values) => [category!, ...values]);
      });
  }

  update(desk: Client) {
    const ref = this.dialogService.open(ClientComponent, {
      header: 'Editar Afiliado',
      width: '50rem',
      data: desk,
    });
    ref.onClose
      .pipe(filter((result?: Client) => !!result))
      .subscribe((result) => {
        this.clients.update((values) => {
          const index = values.findIndex((el) => el.id === desk.id);
          values[index] = result!;
          return [...values];
        });
      });
  }

  changePage(){
    
  }
}
