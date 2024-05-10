import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { PrimengModule } from '../../../primeng.module';
import { ConfigService } from '../../services/config.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, PrimengModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private configService = inject(ConfigService);
  private messageService = inject(MessageService);
  settings = signal;

  FormSettings: FormGroup = this.fb.group({
    basePrice: [0, Validators.required],
    maxUnits: [0, Validators.required],
    pricePerExcessUnit: [0, Validators.required],
    maxDelayMonths: [0, Validators.required],
  });

  ngOnInit(): void {
    this.configService.geSettings().subscribe((resp) => {
      this.FormSettings.patchValue(resp);
    });
  }

  save() {
    this.configService
      .changeSettins(this.FormSettings.value)
      .subscribe((resp) => {
        this.FormSettings.patchValue(resp);
        this.messageService.add({
          severity: 'success',
          summary: 'Cambios guardados',
          detail: 'Se actualizaron los parametros',
          life: 2000,
        });
      });
  }
}
