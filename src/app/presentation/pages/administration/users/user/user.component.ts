import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrimengModule } from '../../../../../primeng.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { userResponse } from '../../../../../infrastructure/interfaces';
import { UserService } from '../../../../services';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PrimengModule],
  templateUrl: './user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private userService = inject(UserService);
  readonly roles: string[] = ['officer', 'admin', 'reader'];
  user: userResponse | undefined = inject(DynamicDialogConfig).data;
  selectedRoles: string[] = [];
  FormUser: FormGroup = this.fb.nonNullable.group({
    fullname: ['', Validators.required],
    login: ['', Validators.required],
    password: ['', Validators.required],
  });

  updatePassword: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (this.user) {
      this.FormUser.removeControl('password');
      const { roles, ...pros } = this.user;
      this.FormUser.patchValue(pros);
      this.selectedRoles = [...roles];
    }
  }

  save() {
    const subscription = this.user
      ? this.userService.update(this.user._id, {
          ...this.FormUser.value,
          roles: this.selectedRoles,
        })
      : this.userService.create({
          ...this.FormUser.value,
          roles: this.selectedRoles,
        });
    subscription.subscribe((resp) => {
      this.ref.close(resp);
    });
  }

  togglePassword() {
    if (this.updatePassword) {
      this.FormUser.setControl(
        'password',
        new FormControl('', Validators.required)
      );
      return;
    }
    this.FormUser.removeControl('password');
  }

  get isValidForm() {
    return this.FormUser.valid && this.selectedRoles.length > 0;
  }
}
