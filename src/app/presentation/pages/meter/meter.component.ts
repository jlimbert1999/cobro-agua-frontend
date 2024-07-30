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

@Component({
  selector: 'app-meter',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
  templateUrl: './meter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles:`
  .flex-container {
      display: flex;
      flex-direction: column;
      justify-content: center; /* Centra verticalmente */
      align-items: center; /* Centra horizontalmente */
      height: 100vh; /* Ocupa toda la altura de la ventana */
      border: 1px solid #000; /* Solo para visualización */
    }
    .content {
      border: 1px solid red; /* Solo para visualización */
      padding: 20px;
    }
  `
})
export class MeterComponent {
  private customerReading = inject(ClientService);
  private readingService = inject(ReadingService);
  customers = signal<clientResponse[]>([]);

  customer = signal<any | null>(null);

  selectedCity: any;

  searchCustomerByMeterReading(value: string) {
    if (!value) return;
    this.customerReading.searchByMeterNumber(value).subscribe((data) => {
      this.customers.set([...data]);
      this.customer.set(data[0])
      console.log(data);
    });
  }
}
