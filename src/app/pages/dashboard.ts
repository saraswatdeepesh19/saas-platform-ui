import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { currentPeriod } from '../core/errors';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  template: `
    <h2>Dashboard</h2>
    <div class="grid">
      <div class="card stat"><span>Tenant</span><strong>{{ plan()?.tenantName ?? '—' }}</strong></div>
      <div class="card stat"><span>Plan</span><strong>{{ plan()?.planType ?? '—' }}</strong></div>
      <div class="card stat"><span>Devices</span><strong>{{ devices()?.length ?? '—' }}</strong></div>
      <div class="card stat"><span>Active sessions</span><strong>{{ activeSessions() }}</strong></div>
      <div class="card stat"><span>Minutes ({{ period }})</span><strong>{{ usage()?.totalMinutes ?? 0 }}</strong></div>
    </div>
    <p class="muted">Billing plan appears after the tenant event reaches billing (eventual consistency).
      <a routerLink="/billing">Go to billing</a></p>
  `,
})
export class Dashboard {
  private readonly api = inject(ApiService);
  protected readonly period = currentPeriod();

  protected readonly plan = toSignal(this.api.plan().pipe(catchError(() => of(null))));
  protected readonly devices = toSignal(this.api.devices().pipe(catchError(() => of(null))));
  protected readonly sessions = toSignal(this.api.sessions().pipe(catchError(() => of([]))), { initialValue: [] });
  protected readonly usage = toSignal(this.api.usageSummary(this.period).pipe(catchError(() => of(null))));
  protected readonly activeSessions = computed(() => this.sessions().filter((s) => s.status === 'ACTIVE').length);
}
