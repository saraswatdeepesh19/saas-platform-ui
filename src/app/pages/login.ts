import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { errorMessage } from '../core/errors';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <form class="card auth" [formGroup]="form" (ngSubmit)="submit()">
      <h2>Sign in</h2>
      <label>Email
        <input type="email" formControlName="email" autocomplete="username" />
      </label>
      <label>Password
        <input type="password" formControlName="password" autocomplete="current-password" />
      </label>
      @if (error()) { <p class="error">{{ error() }}</p> }
      <button class="btn" [disabled]="form.invalid || busy()">{{ busy() ? 'Signing in…' : 'Sign in' }}</button>
      <p class="muted">No account? <a routerLink="/register">Register a tenant</a></p>
    </form>
  `,
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  protected readonly busy = signal(false);
  protected readonly error = signal('');

  submit(): void {
    if (this.form.invalid) return;
    this.busy.set(true);
    this.error.set('');
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (e) => {
        this.error.set(e.status === 401 ? 'Invalid email or password.' : errorMessage(e));
        this.busy.set(false);
      },
    });
  }
}
