import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService } from '../core/api.service';
import { errorMessage } from '../core/errors';
import { Session } from '../core/models';

@Component({
  selector: 'app-sessions',
  imports: [DatePipe],
  template: `
    <h2>Sessions</h2>
    <button class="btn secondary" (click)="load()">Refresh</button>
    @if (error()) { <p class="error">{{ error() }}</p> }
    <table class="card">
      <thead><tr><th>Session</th><th>Device</th><th>Status</th><th>Started</th><th>Ended</th><th>Seconds</th><th></th></tr></thead>
      <tbody>
        @for (s of sessions(); track s.sessionId) {
          <tr>
            <td class="mono">{{ s.sessionId.slice(0, 8) }}</td>
            <td class="mono">{{ s.deviceId.slice(0, 8) }}</td>
            <td><span class="badge" [class]="s.status.toLowerCase()">{{ s.status }}</span></td>
            <td>{{ s.startedAt | date: 'medium' }}</td>
            <td>{{ s.endedAt ? (s.endedAt | date: 'medium') : '—' }}</td>
            <td>{{ s.durationSec ?? '—' }}</td>
            <td>@if (s.status === 'ACTIVE') { <button class="btn small danger" (click)="end(s)">End</button> }</td>
          </tr>
        } @empty {
          <tr><td colspan="7" class="muted">No sessions yet.</td></tr>
        }
      </tbody>
    </table>
  `,
})
export class Sessions implements OnInit {
  private readonly api = inject(ApiService);
  protected readonly sessions = signal<Session[]>([]);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.api.sessions().subscribe({
      next: (s) => this.sessions.set(s),
      error: (e) => this.error.set(errorMessage(e)),
    });
  }

  end(s: Session): void {
    this.error.set('');
    this.api.endSession(s.sessionId).subscribe({
      next: () => this.load(),
      error: (e) => this.error.set(errorMessage(e)),
    });
  }
}
