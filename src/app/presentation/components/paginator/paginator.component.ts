import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule, PaginatorModule],
  template: `
   <!-- <p-paginator
    [first]="offset()"
    [rows]="limit()"
    [totalRecords]="length()"
    (onPageChange)="changePage($event)"
    [showCurrentPageReport]="true"
    currentPageReportTemplate="{first} - {last} of {totalRecords}"
    [showPageLinks]="false"
    [showFirstLastIcon]="false"
  ></p-paginator> -->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  // limit = model.required<number>();
  // offset = input.required<number>();
  // length = input.required<number>();
  // onPageChange=
  

  changePage(){
    
  }
}
