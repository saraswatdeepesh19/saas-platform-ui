import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { errorMessage } from '../core/errors';
import { Role } from '../core/models';

@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule],
  template: `
    <h2>Create user</h2>
    <form class="card auth" [formGroup]="form" (ngSubmit)="submit()">
      <label>Email <input type="email" formControlName="email" /></label>
      <label>Password (8–72 characters)
        <input type="password" formControlName="password" autocomplete="new-password" />
      </label>
      <label>Role
        <select formControlName="role">
          @for (r of roles; track r) { <option [value]="r">{{ r }}</option> }
        </select>
      </label>
      @if (error()) { <p class="error">{{ error() }}</p> }
      @if (created()) { <p class="ok">Created {{ created() }}</p> }
      <button class="btn" [disabled]="form.invalid">Create</button>
    </form>
  `,
})
export class Users {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly roles: Role[] = ['USER', 'ADMIN'];
  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
    role: ['USER' as Role],
  });
  protected readonly error = signal('');
  protected readonly created = signal('');

  submit(): void {
    if (this.form.invalid) return;
    this.error.set('');
    this.created.set('');
    this.api.createUser(this.form.getRawValue()).subscribe({
      next: (u) => {
        this.created.set(u.email);
        this.form.reset({ email: '', password: '', role: 'USER' });
      },
      error: (e) => this.error.set(errorMessage(e)),
    });
  }
}
