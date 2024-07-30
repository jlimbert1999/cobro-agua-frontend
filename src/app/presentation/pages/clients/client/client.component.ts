import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimengModule } from '../../../../primeng.module';
import { ClientService } from '../../../services';
import { Client } from '../../../../domain/models/client.model';
import { customerType } from '../../../../infrastructure';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, PrimengModule, ReactiveFormsModule],
  templateUrl: './client.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private refDialog = inject(DynamicDialogRef);
  private clientService = inject(ClientService);

  private client: Client | undefined = inject(DynamicDialogConfig).data;

  customerTypes = signal<customerType[]>([]);
  FormClient: FormGroup = this.formBuilder.nonNullable.group({
    firstname: ['', [Validators.required]],
    middlename: ['', Validators.required],
    lastname: [''],
    dni: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    meterNumber: ['', Validators.required],
    type: ['', Validators.required],
  });

  constructor() {}

  ngOnInit(): void {
    this._getCustomerTypes();
    this._loadFormData();
  }

  save() {
    console.log(this.client?.id);
    const subscription = this.client
      ? this.clientService.update(this.client.id, this.FormClient.value)
      : this.clientService.create(this.FormClient.value);
    subscription.subscribe((resp) => {
      this.refDialog.close(resp);
    });
  }

  private _getCustomerTypes() {
    this.clientService.getCustomerTypes().subscribe((data) => {
      this.customerTypes.set(data);
    });
  }

  private _loadFormData() {
    if (!this.client) return;
    console.log(this.client);
    const { type, ...props } = this.client;
    this.FormClient.patchValue({ ...props, type: type.id });
  }
}
