import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';

interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}

@Component({
  selector: 'paginator',
  standalone: true,
  imports: [CommonModule, PaginatorModule],
  template: `
    <div class="flex align-items-center justify-content-end">
      <span class="mx-1 text-color">Pagina: </span>
      <p-paginator
        [first]="10"
        [rows]="1"
        [totalRecords]="length()"
        (onPageChange)="changePage($event)"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="{first} - {last} de {totalRecords}"
        [showPageLinks]="false"
        [showFirstLastIcon]="true"
      ></p-paginator>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  limit = model.required<number>();
  index = model.required<number>();
  length = input.required<number>();
  onPageChange = output<void>();

  changePage({ page = 0, rows = 10 }: PageEvent) {
    this.limit.set(rows);
    this.index.set(page);
    this.onPageChange.emit();
  }
}
