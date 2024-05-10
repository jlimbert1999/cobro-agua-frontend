import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PrimengModule } from '../../../../primeng.module';
import { Client } from '../../../../domain/models';
import { ClientService, ReadingService } from '../../../services';
import { readingResponse } from '../../../../infrastructure/interfaces';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimengModule],
  templateUrl: './payments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentsComponent implements OnInit {
  private client: Client = inject(DynamicDialogConfig).data;
  private readingService = inject(ReadingService);

  debts = signal<readingResponse[]>([]);
  paymentDebts = signal<readingResponse[]>([]);

  

  ngOnInit(): void {
    this.readingService.getDebts(this.client.id).subscribe((data) => {
      console.log(data);
      this.debts.set(data);
    });
  }

  save(){
    
  }
}
