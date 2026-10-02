import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { currentPeriod, errorMessage } from '../core/errors';
import { UsageSummary } from '../core/models';

const PERIOD = /^\d{4}-(0[1-9]|1[0-2])$/;

@Component({
  selector: 'app-usage',
  imports: [ReactiveFormsModule],
  template: `
    <h2>Usage</h2>
    <form class="card row" (submit)="$event.preventDefault(); load()">
      <label>Period (YYYY-MM) <input [formControl]="period" /></label>
      <button class="btn" [disabled]="period.invalid">Load</button>
    </form>
    @if (error()) { <p class="error">{{ error() }}</p> }
    @if (summary(); as s) {
      <div class="grid">
        <div class="card stat"><span>Sessions</span><strong>{{ s.totalSessions }}</strong></div>
        <div class="card stat"><span>Seconds</span><strong>{{ s.totalSeconds }}</strong></div>
        <div class="card stat"><span>Minutes</span><strong>{{ s.totalMinutes }}</strong></div>
      </div>
    }
  `,
})
export class Usage {
  private readonly api = inject(ApiService);
  protected readonly period = new FormControl(currentPeriod(), {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(PERIOD)],
  });
  protected readonly summary = signal<UsageSummary | null>(null);
  protected readonly error = signal('');

  constructor() {
    this.load();
  }

  load(): void {
    if (this.period.invalid) return;
    this.error.set('');
    this.api.usageSummary(this.period.value).subscribe({
      next: (s) => this.summary.set(s),
      error: (e) => this.error.set(errorMessage(e)),
    });
  }
}
