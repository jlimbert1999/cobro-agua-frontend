import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  untracked,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { ClientService, ReadingService } from '../../services';
import { DialogService } from 'primeng/dynamicdialog';
import { MeterReadingComponent } from '../clients/meter-reading/meter-reading.component';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { Client } from '../../../domain';

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
  customer = signal<Client | null>(null);

  @ViewChild('drop') dropDown!: Dropdown;

  constructor() {
    effect(() => {
      if (!this.customer()) return;
      this.addMeterReading(this.customer()!);
      untracked(() => {
        this.dropDown.clear();
      });
    });
  }

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
