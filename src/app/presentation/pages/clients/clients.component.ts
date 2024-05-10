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
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimengModule } from '../../../primeng.module';
import { Client } from '../../../consumer/models';
import { ClientService } from '../../../consumer/services/client.service';
import { action, client } from '../../../consumer/interfaces';
import { ClientComponent } from './client/client.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, PrimengModule, FormsModule, ReactiveFormsModule],
  templateUrl: `./clients.component.html`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class ClientsComponent implements OnInit {
  private dialogService = inject(DialogService);
  visible = signal<boolean>(false);
  clients = signal<Client[]>([]);
  client = signal<Client | undefined>(undefined);
  clientService = inject(ClientService);

  items: any[] | undefined;

  selectedItem: any;

  suggestions: any[] = [];

  FormClient = this.formBuilder.nonNullable.group({
    firstname: ['', [Validators.required]],
    middlename: ['', [Validators.required]],
    lastname: [''],
    dni: [0, [Validators.required]],
    phone: [0, [Validators.required]],
  });
  ref: DynamicDialogRef | undefined;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.clientService.getClients().subscribe((resp) => {
      this.clients.set(resp);
    });
  }
  add() {
    this.ref = this.dialogService.open(ClientComponent, {
      header: 'Registro Afiliado',
      width: '55rem',
    });
  }

  edit(client: Client) {
    const { actions, ...props } = client;
    this.FormClient.patchValue({
      ...props,
    });
    this.client.set(client);
    this.visible.set(true);
  }

  save() {
    if (this.client()) {
      this.clientService
        .editClient(this.client()!._id, this.FormClient.value)
        .subscribe((newAction) => {
          this.clients.update((values) => {
            const index = values.findIndex(
              (el) => el._id === this.client()!._id
            );
            values[index] = newAction;
            return values;
          });
          this.closeDialog();
        });
    } else {
      this.clientService
        .addClient(this.FormClient.value)
        .subscribe((newClient) => {
          this.clients.update((values) => [newClient, ...values]);
          this.closeDialog();
        });
    }
  }

  closeDialog() {
    this.visible.set(false);
    this.FormClient.reset({});
    this.client.set(undefined);
  }

  searchAvailableActions(term: string) {
    this.clientService.searchAvilableActions(term).subscribe((resp) => {
      this.suggestions = resp;
    });
  }
}
