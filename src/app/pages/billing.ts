import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { currentPeriod, errorMessage } from '../core/errors';
import { Invoice, TenantPlan } from '../core/models';

@Component({
  selector: 'app-billing',
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe],
  template: `
    <h2>Billing</h2>
    @if (plan(); as p) {
      <div class="card">
        <strong>{{ p.planType }}</strong> · {{ p.currency }} · {{ p.billingEmail }}
      </div>
    }
    @if (isAdmin) {
      <form class="card row" (submit)="$event.preventDefault(); generate()">
        <label>Period (YYYY-MM) <input [formControl]="period" /></label>
        <button class="btn" [disabled]="period.invalid">Generate invoice</button>
      </form>
    } @else {
      <p class="muted">Only administrators can generate invoices.</p>
    }
    @if (error()) { <p class="error">{{ error() }}</p> }

    @for (inv of invoices(); track inv.id) {
      <section class="card">
        <header class="row between">
          <div><strong>{{ inv.invoiceNumber }}</strong> · {{ inv.period }} · {{ inv.createdAt | date: 'medium' }}</div>
          <div><span class="badge">{{ inv.status }}</span>
            <strong> {{ inv.totalAmount | currency: inv.currency }}</strong></div>
        </header>
        <table>
          <thead><tr><th>Description</th><th>Qty (min)</th><th>Unit</th><th>Amount</th></tr></thead>
          <tbody>
            @for (l of inv.lines; track $index) {
              <tr>
                <td>{{ l.description }}</td><td>{{ l.quantity }}</td>
                <td>{{ l.unitPrice | currency: inv.currency }}</td>
                <td>{{ l.amount | currency: inv.currency }}</td>
              </tr>
            }
          </tbody>
        </table>
      </section>
    } @empty {
      <p class="muted">No invoices yet.</p>
    }
  `,
})
export class Billing implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  protected readonly isAdmin = this.auth.isAdmin();
  protected readonly plan = signal<TenantPlan | null>(null);
  protected readonly invoices = signal<Invoice[]>([]);
  protected readonly error = signal('');
  protected readonly period = new FormControl(currentPeriod(), {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/^\d{4}-(0[1-9]|1[0-2])$/)],
  });

  ngOnInit(): void {
    this.api.plan().subscribe({ next: (p) => this.plan.set(p), error: () => this.plan.set(null) });
    this.load();
  }

  private load(): void {
    this.api.invoices().subscribe({
      next: (i) => this.invoices.set(i),
      error: (e) => this.error.set(errorMessage(e)),
    });
  }

  generate(): void {
    this.error.set('');
    this.api.generateInvoice(this.period.value).subscribe({
      next: () => this.load(),
      error: (e) => this.error.set(errorMessage(e)),
    });
  }
}
