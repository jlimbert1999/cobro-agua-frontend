import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { ClientService, ReadingService } from '../../services';
import { clientResponse } from '../../../infrastructure/interfaces';
import { Client } from '../../../domain/models';
import { DialogService } from 'primeng/dynamicdialog';
import { MeterReadingComponent } from '../clients/meter-reading/meter-reading.component';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-meter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
  ],
  templateUrl: './meter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class MeterComponent {
  private dialogService = inject(DialogService);
  private clientService = inject(ClientService);

  customers = signal<Client[]>([]);

  searchCustomer(value: string) {
    if (value === '') return;
    this.clientService.searchByMeterNumber(value).subscribe((data) => {
      this.customers.set([...data]);
    });
  }

  addMeterReading(client: Client) {
    this.dialogService.open(MeterReadingComponent, {
      header: 'Registrar Lectura',
      width: '30rem',
      data: client,
      breakpoints: {
        '960px': '90vw',
      },
    });
  }
}
