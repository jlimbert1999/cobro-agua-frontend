import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  model,
  signal,
} from '@angular/core';
import { filter } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { PrimengModule } from '../../../primeng.module';
import { ClientComponent } from './client/client.component';
import { MeterReadingComponent } from './meter-reading/meter-reading.component';
import { PaymentsComponent } from './payments/payments.component';
import { PageProps, PaginatorComponent } from '../../components';
import { ClientService } from '../../services';
import { Client } from '../../../domain/models';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, PrimengModule, PaginatorComponent],
  templateUrl: `./clients.component.html`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class ClientsComponent implements OnInit {
  private dialogService = inject(DialogService);
  private clientService = inject(ClientService);

  datasource = signal<Client[]>([]);
  datasize = signal(0);

  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  term = signal<string>('');

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    const subscription = this.term()
      ? this.clientService.search(this.term(), this.limit(), this.offset())
      : this.clientService.findAll(this.limit(), this.offset());
    subscription.subscribe(({ clients, length }) => {
      this.datasource.set(clients);
      this.datasize.set(length);
    });
  }

  create() {
    const ref = this.dialogService.open(ClientComponent, {
      header: 'Crear Afiliado',
      width: '50rem',
    });
    ref.onClose
      .pipe(filter((result: Client) => !!result))
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

  update(desk: Client) {
    const ref = this.dialogService.open(ClientComponent, {
      header: 'Editar Afiliado',
      width: '50rem',
      data: desk,
    });
    ref.onClose
      .pipe(filter((result?: Client) => !!result))
      .subscribe((result) => {
        this.datasource.update((values) => {
          const index = values.findIndex((el) => el.id === desk.id);
          values[index] = result!;
          return [...values];
        });
      });
  }

  addMeterReading(client: Client) {
    this.dialogService.open(MeterReadingComponent, {
      header: 'Registrar Lectura',
      width: '35rem',
      data: client,
    });
  }

  payment(client: Client) {
    this.dialogService.open(PaymentsComponent, {
      header: 'Registrar pago',
      width: '60rem',
      data: client,
    });
  }

  onSearch(value: string) {
    this.term.set(value);
    this.getData();
  }

  onPageChange(event: PageProps) {
    this.limit.set(event.pageSize);
    this.index.set(event.pageIndex);
    this.getData();
  }
}
