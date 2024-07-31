import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogService } from 'primeng/dynamicdialog';
import { CustomerTypeComponent } from './customer-type/customer-type.component';
import { CustomerTypeService } from '../../../services';
import { customerTypeResponse } from '../../../../infrastructure';

@Component({
  selector: 'app-customer-types',
  standalone: true,
  imports: [CommonModule, ToolbarModule, TableModule, ButtonModule],
  templateUrl: './customer-types.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class CustomerTypesComponent implements OnInit {
  private dialogService = inject(DialogService);
  private customerTypeService = inject(CustomerTypeService);

  datasource = signal<customerTypeResponse[]>([]);
  datasize = signal(0);
  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  term = signal<string>('');

  ngOnInit(): void {
    this.getData();
  }

  create() {
    const ref = this.dialogService.open(CustomerTypeComponent, {
      header: 'Configuracion Accionista',
      width: '50rem',
    });
    ref.onClose.subscribe((result?: customerTypeResponse) => {
      if (!result) return;
      this.datasource.update((values) => {
        if (this.limit() === values.length) values.pop();
        return [result, ...values];
      });
      this.datasize.update((val) => (val += 1));
    });
  }

  update(customerType: customerTypeResponse) {
    const ref = this.dialogService.open(CustomerTypeComponent, {
      header: 'Configuracion Accionista',
      width: '50rem',
      data: customerType,
    });
    ref.onClose.subscribe((result?: customerTypeResponse) => {
      if (!result) return;
      this.datasource.update((values) => {
        const index = values.findIndex((el) => el.id === result.id);
        values[index] = result!;
        return [...values];
      });
    });
  }

  private getData() {
    this.customerTypeService
      .findAll(this.limit(), this.offset(), this.term())
      .subscribe(({ customerTypes, length }) => {
        this.datasource.set(customerTypes);
        this.datasize.set(length);
      });
  }
}
