import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Action } from '../../models';
import { ClientService } from '../../services/client.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimengModule } from '../../../primeng/primeng.module';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [CommonModule, PrimengModule, ReactiveFormsModule],
  templateUrl: './actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsComponent {
  visible = signal<boolean>(false);
  dialogMode: 'edit' | 'create' = 'create';
  actions = signal<Action[]>([]);
  action?: Action;
  clientService = inject(ClientService);
  fb = inject(FormBuilder);
  FormAction = this.fb.nonNullable.group({
    address: ['', Validators.required],
    code: ['', Validators.required],
    cost: [0, Validators.required],
  });

  ngOnInit(): void {
    this.clientService.getActions().subscribe((resp: any) => {
      this.actions.set(resp);
    });
  }

  add() {
    this.visible.set(true);
  }

  edit(action: Action) {
    this.FormAction.patchValue(action);
    this.action = action;
    this.visible.set(true);
  }

  save() {
    if (this.action) {
      this.clientService
        .editAction(this.action._id, this.FormAction.value)
        .subscribe((newAction) => {
          this.actions.update((values) => {
            const index = values.findIndex((el) => el._id === this.action!._id);
            values[index] = newAction;
            return values;
          });
          this.closeDialog();
        });
    } else {
      this.clientService
        .addAction(this.FormAction.value)
        .subscribe((action) => {
          this.actions.update((values) => [action, ...values]);
          this.closeDialog();
        });
    }
  }

  closeDialog() {
    this.visible.set(false);
    this.FormAction.reset({});
    this.action = undefined;
  }
}
