import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { discount } from '../../../../infrastructure';
import { DiscountService } from '../../../services';
import { DiscountDialogComponent } from './discount-dialog/discount-dialog.component';

@Component({
  selector: 'app-discounts',
  standalone: true,
  imports: [TableModule, ToolbarModule, ButtonModule],
  templateUrl: './discounts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscountsComponent implements OnInit {

  private dialogService = inject(DialogService);
  private customerTypeService = inject(DiscountService);
  datasource = signal<discount[]>([]);
  datasize = signal(0);
  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  term = signal<string>('');

  ngOnInit(): void {
   this.getData()
  }

  create() {
    const ref = this.dialogService.open(DiscountDialogComponent, {
      header: 'Crear descuento',
      width: '50rem',
    });
    ref.onClose.subscribe((result?: discount) => {
      if (!result) return;
      this.datasource.update((values) => {
        if (this.limit() === values.length) values.pop();
        return [result, ...values];
      });
      this.datasize.update((val) => (val += 1));
    });
  }

  update(customerType: discount) {
    const ref = this.dialogService.open(DiscountDialogComponent, {
      header: 'Editar descuento',
      width: '50rem',
      data: customerType,
    });
    ref.onClose.subscribe((result?: discount) => {
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
      .subscribe(({ discounts, length }) => {
        this.datasource.set(discounts);
        this.datasize.set(length);
      });
  }
}
