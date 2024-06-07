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
import { MeterReadingComponent } from './meter-reading/meter-reading.component';
import { PaymentComponent } from './payment/payment.component';
import { PageProps, PaginatorComponent } from '../../components';
import { ClientService, ReadingService } from '../../services';
import { Client } from '../../../domain/models';
import { MenuItem, MessageService } from 'primeng/api';
import { DetailReadingComponent } from './detail-reading/detail-reading.component';
import Swal from 'sweetalert2';
import { read, utils } from 'xlsx';

export interface uploadData {
  NOMBRE: string;
  PATERNO: string;
  MATERNO: string;
  CI: string;
  TELEFONO: string;
  DIRECCION: string;
}

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
  private readingService = inject(ReadingService);
  private messageService = inject(MessageService);

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
    this.dialogService.open(PaymentComponent, {
      header: 'Registrar pago',
      width: '80%',
      maximizable: true,
      data: client,
    });
  }

  viewReadings(client: Client) {
    this.dialogService.open(DetailReadingComponent, {
      header: 'Lecturas',
      maximizable: true,
      data: client,
      breakpoints: {
        '1600px': '50vw',
        '960px': '100vw',
      },
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

  getMenuItems(customer: Client): MenuItem[] {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.update(customer),
      },
      {
        label: 'Agregar lectura',
        icon: 'pi pi-book',
        command: () => this.addMeterReading(customer),
      },
      {
        label: 'Agregar pago',
        icon: 'pi pi-credit-card',
        command: () => this.payment(customer),
      },
      {
        label: 'Ver lecturas',
        icon: 'pi pi-align-justify',
        command: () => this.viewReadings(customer),
      },
    ];
  }

  async loadExcelFile() {
    const { value: file } = await Swal.fire({
      title: 'Seleccione el archivo a cargar',
      text: 'Formatos permitidos :ods, csv, xlsx',
      input: 'file',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      inputAttributes: {
        accept:
          '.ods, csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
        'aria-label': 'Cargar archivo excel',
      },
    });
    if (file) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (e) => {
        const wb = read(reader.result, {
          type: 'binary',
          cellDates: true,
        });
        const data: uploadData[] = utils.sheet_to_json<any>(
          wb.Sheets[wb.SheetNames[0]]
        );
        this.readingService
          .upload(
            data.map((el) => ({
              firstname: el.NOMBRE,
              middlename: el.PATERNO,
              lastname: el.MATERNO,
              dni: el.CI,
              phone: parseInt(el.TELEFONO),
              address: el.DIRECCION,
            }))
          )
          .subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Datos subidos correctamente',
            });
            this.getData();
          });
      };
    }
  }
}
