import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ApiService } from './api.service';
import { LoginRequest } from './models';

interface JwtPayload {
  sub: string;
  tenantId: string;
  roles?: string[] | string;
  exp: number;
}

const KEY = 'saas.token';

function decode(token: string | null): JwtPayload | null {
  if (!token) return null;
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(part)) as JwtPayload;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  // sessionStorage limits token lifetime to the tab; trade-off vs. HttpOnly cookies is in the guide.
  private readonly _token = signal<string | null>(sessionStorage.getItem(KEY));

  readonly token = this._token.asReadonly();
  readonly claims = computed(() => decode(this._token()));
  readonly isAuthenticated = computed(() => {
    const c = this.claims();
    return !!c && c.exp * 1000 > Date.now();
  });
  readonly tenantId = computed(() => this.claims()?.tenantId ?? '');
  readonly isAdmin = computed(() => {
    const roles = this.claims()?.roles;
    const list = Array.isArray(roles) ? roles : roles ? [roles] : [];
    return list.some((r) => r === 'ADMIN' || r === 'ROLE_ADMIN');
  });

  login(body: LoginRequest) {
    return this.api.login(body).pipe(
      tap((res) => {
        sessionStorage.setItem(KEY, res.accessToken);
        this._token.set(res.accessToken);
      }),
    );
  }

  logout(): void {
    sessionStorage.removeItem(KEY);
    this._token.set(null);
    this.router.navigateByUrl('/login');
  }
}
