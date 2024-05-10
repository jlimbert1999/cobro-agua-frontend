import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimengModule } from '../../../../primeng.module';
import { ClientService } from '../../../services';
import { Client } from '../../../../domain/models/client.model';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, PrimengModule, ReactiveFormsModule],
  templateUrl: './client.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientComponent {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private clientService = inject(ClientService);

  private client: Client | undefined = inject(DynamicDialogConfig).data;

  FormClient = this.fb.nonNullable.group({
    firstname: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    middlename: [''],
    dni: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    address: ['', Validators.required],
  });

  constructor() {}

  save() {
    const subscription = this.client
      ? this.clientService.update(this.client.id, this.FormClient.value)
      : this.clientService.create(this.FormClient.value);
    subscription.subscribe((resp) => this.ref.close(resp));
  }
}
