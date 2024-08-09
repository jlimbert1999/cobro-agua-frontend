import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-backgroud',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './backgroud.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroudComponent { }
