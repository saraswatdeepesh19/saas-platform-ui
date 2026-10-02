import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateUserRequest,
  Device,
  DeviceRequest,
  Invoice,
  LoginRequest,
  LoginResponse,
  RegisterTenantRequest,
  Session,
  TenantPlan,
  TenantResponse,
  UsageSummary,
  UserResponse,
} from './models';

// '/api' is rewritten to the gateway (:8080) by proxy.conf.json in dev.
const BASE = '/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${BASE}/auth/login`, body);
  }
  registerTenant(body: RegisterTenantRequest): Observable<TenantResponse> {
    return this.http.post<TenantResponse>(`${BASE}/auth/register-tenant`, body);
  }
  me(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${BASE}/auth/me`);
  }
  createUser(body: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${BASE}/auth/users`, body);
  }

  devices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${BASE}/devices`);
  }
  createDevice(body: DeviceRequest): Observable<Device> {
    return this.http.post<Device>(`${BASE}/devices`, body);
  }
  updateDevice(id: string, body: DeviceRequest): Observable<Device> {
    return this.http.put<Device>(`${BASE}/devices/${id}`, body);
  }
  retireDevice(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE}/devices/${id}`);
  }

  sessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${BASE}/sessions`);
  }
  startSession(deviceId: string): Observable<Session> {
    return this.http.post<Session>(`${BASE}/devices/${deviceId}/sessions/start`, {});
  }
  endSession(sessionId: string): Observable<Session> {
    return this.http.post<Session>(`${BASE}/sessions/${sessionId}/end`, {});
  }

  usageSummary(period: string): Observable<UsageSummary> {
    return this.http.get<UsageSummary>(`${BASE}/usage/summary`, {
      params: new HttpParams().set('period', period),
    });
  }

  plan(): Observable<TenantPlan> {
    return this.http.get<TenantPlan>(`${BASE}/billing/plan`);
  }
  invoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${BASE}/billing/invoices`);
  }
  generateInvoice(period: string): Observable<Invoice> {
    return this.http.post<Invoice>(`${BASE}/billing/invoices/generate`, null, {
      params: new HttpParams().set('period', period),
    });
  }
}
