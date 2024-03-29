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
import { DialogService } from 'primeng/dynamicdialog';
import { PrimengModule } from '../../../primeng/primeng.module';
import { Client } from '../../models';
import { ClientService } from '../../services/client.service';
import { action, client } from '../../interfaces';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, PrimengModule, FormsModule, ReactiveFormsModule],
  templateUrl: `./clients.component.html`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class ClientsComponent implements OnInit {
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

  constructor(
    public dialogService: DialogService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.clientService.getClients().subscribe((resp) => {
      this.clients.set(resp);
    });
  }
  add() {
    this.visible.set(true);
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
