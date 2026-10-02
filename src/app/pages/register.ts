import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { errorMessage } from '../core/errors';
import { PlanType } from '../core/models';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <form class="card auth" [formGroup]="form" (ngSubmit)="submit()">
      <h2>Register tenant</h2>
      <label>Organization name
        <input formControlName="tenantName" maxlength="150" />
      </label>
      <label>Admin email
        <input type="email" formControlName="adminEmail" autocomplete="username" />
      </label>
      <label>Password (8–72 characters)
        <input type="password" formControlName="password" autocomplete="new-password" />
      </label>
      <label>Plan
        <select formControlName="planType">
          @for (p of plans; track p) { <option [value]="p">{{ p }}</option> }
        </select>
      </label>
      @if (error()) { <p class="error">{{ error() }}</p> }
      <button class="btn" [disabled]="form.invalid || busy()">Create tenant</button>
      <p class="muted">Already registered? <a routerLink="/login">Sign in</a></p>
    </form>
  `,
})
export class Register {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly plans: PlanType[] = ['FREE_TIER', 'FLAT_RATE', 'TIERED'];
  protected readonly form = this.fb.group({
    tenantName: ['', [Validators.required, Validators.maxLength(150)]],
    adminEmail: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
    planType: ['FREE_TIER' as PlanType],
  });
  protected readonly busy = signal(false);
  protected readonly error = signal('');

  submit(): void {
    if (this.form.invalid) return;
    this.busy.set(true);
    this.error.set('');
    this.api.registerTenant(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: (e) => {
        this.error.set(errorMessage(e));
        this.busy.set(false);
      },
    });
  }
}
