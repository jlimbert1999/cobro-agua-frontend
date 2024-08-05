import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PrimengModule } from '../../../primeng.module';
import { ClientComponent } from './client/client.component';
import { MeterReadingComponent } from './meter-reading/meter-reading.component';
import { PaymentComponent } from './payment/payment.component';
import { PageProps, PaginatorComponent } from '../../components';
import { ClientService, ReadingService } from '../../services';
import { Client, CustomerStatus } from '../../../domain/models';
import { MenuItem, MessageService } from 'primeng/api';
import { DetailReadingComponent } from './detail-reading/detail-reading.component';
import Swal from 'sweetalert2';
import { read, utils } from 'xlsx';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

export interface uploadData {
  NOMBRES: string;
  PATERNO: string;
  MATERNO: string;
  'C.I.': string;
  CELULAR: string;
  'Nro. Medidor': string;
  OTB: string;
}

interface selectOption {
  id: string | number | null;
  name: string;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrimengModule,
    PaginatorComponent,
    InputGroupModule,
    InputGroupAddonModule,
  ],
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

  customerTypes = signal<selectOption[]>([]);
  customerStatus = signal<selectOption[]>([
    { id: null, name: 'Ninguno' },
    { id: CustomerStatus.ENABLED, name: 'EN CURSO' },
    { id: CustomerStatus.DISABLED, name: 'CORTE' },
  ]);
  formFilter = inject(FormBuilder).group({
    fullname: [null],
    meterNumber: [null],
    dni: [null],
    type: [null],
    status: [null],
  });

  menuOptions = signal<MenuItem[]>([]);

  public dynamicMenuItems$: BehaviorSubject<MenuItem[]> = new BehaviorSubject(
    [] as MenuItem[]
  );

  ngOnInit(): void {
    this.getCustomerTypes();
    this.getData();
  }

  getData() {
    this.clientService
      .findAll(this.limit(), this.offset(), this.formFilter.value)
      .subscribe(({ clients, length }) => {
        this.datasource.set(clients);
        this.datasize.set(length);
      });
  }

  create() {
    const ref = this.dialogService.open(ClientComponent, {
      header: 'Crear Accionista',
      width: '50rem',
      focusOnShow: false,
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
      header: 'Editar Accionista',
      width: '50rem',
      focusOnShow: false,
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
      width: '45rem',
      data: client,
      breakpoints: {
        '960px': '90vw',
      },
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
      width: '40rem',
      breakpoints: {
        '960px': '90vw',
      },
    });
  }

  onPageChange(event: PageProps) {
    this.limit.set(event.pageSize);
    this.index.set(event.pageIndex);
    this.getData();
  }

  showMenu(customer: Client): void {
    this.menuOptions.set([
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
    ]);
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
        console.log(data);
        // const customers = data.map((el) => ({
        //   firstname: el.NOMBRES,
        //   middlename: el.PATERNO,
        //   lastname: el.MATERNO,
        //   dni: el['C.I.'],
        //   phone: el.CELULAR,
        //   meterNumber: el['Nro. Medidor'],
        //   otb: el.OTB ? el.OTB.trim().toUpperCase() : null,
        // }));
        this.clientService.upload(data).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Datos subidos correctamente',
          });
          this.getData();
        });
      };
    }
  }

  getCustomerTypes() {
    this.clientService.getCustomerTypes().subscribe((data) => {
      this.customerTypes.set([
        { id: null, name: 'Ninguno' },
        ...data.map(({ id, name }) => ({ id, name })),
      ]);
    });
  }

  resetControl(path: string) {
    this.formFilter.get(path)?.setValue(null);
    this.getData();
  }

  isControlEmpy(path: string) {
    return !this.formFilter.get(path)?.value;
  }

  get opts() {
    return [
      {
        label: 'New',
        icon: 'pi pi-plus',
        command: () => {
          this.create();
        },
      },
      {
        label: 'Search',
        icon: 'pi pi-search',
        command: () => {
          // this.update();
        },
      },
    ];
  }
}
