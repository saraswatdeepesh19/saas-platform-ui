import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <h1 class="brand">SaaS Platform</h1>
      <nav>
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/devices" routerLinkActive="active">Devices</a>
        <a routerLink="/sessions" routerLinkActive="active">Sessions</a>
        <a routerLink="/usage" routerLinkActive="active">Usage</a>
        <a routerLink="/billing" routerLinkActive="active">Billing</a>
        @if (auth.isAdmin()) {
          <a routerLink="/users" routerLinkActive="active">Users</a>
        }
      </nav>
      <button class="btn secondary" type="button" (click)="auth.logout()">Sign out</button>
    </aside>
    <main class="content"><router-outlet /></main>
  `,
  styles: `
    :host { display: grid; grid-template-columns: 220px 1fr; min-height: 100vh; }
    .sidebar { background: #0f172a; color: #e2e8f0; padding: 1.25rem; display: flex; flex-direction: column; gap: 1.5rem; }
    .brand { font-size: 1.1rem; margin: 0; }
    nav { display: flex; flex-direction: column; gap: .25rem; flex: 1; }
    nav a { color: #cbd5e1; text-decoration: none; padding: .5rem .75rem; border-radius: 6px; }
    nav a.active, nav a:hover { background: #1e293b; color: #fff; }
    .content { padding: 1.5rem 2rem; background: #f8fafc; }
  `,
})
export class Shell {
  protected readonly auth = inject(AuthService);
}
