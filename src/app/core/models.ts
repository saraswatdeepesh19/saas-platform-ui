export type PlanType = 'FREE_TIER' | 'FLAT_RATE' | 'TIERED';
export type Role = 'ADMIN' | 'USER';
export type DeviceType = 'BROWSER' | 'MOBILE' | 'TABLET';

export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresInSec: number;
}
export interface RegisterTenantRequest {
  tenantName: string;
  adminEmail: string;
  password: string;
  planType: PlanType;
}
export interface TenantResponse {
  tenantId: string;
  tenantName: string;
  adminUserId: string;
}
export interface CreateUserRequest {
  email: string;
  password: string;
  role: Role;
}
export interface UserResponse {
  userId: string;
  tenantId: string;
  email: string;
  role: Role;
}

export interface DeviceRequest {
  name: string;
  type: DeviceType;
  os: string | null;
}
export interface Device {
  id: string;
  tenantId: string;
  name: string;
  type: DeviceType;
  os: string | null;
  status: string;
  version: number;
  createdAt: string;
}
export interface Session {
  sessionId: string;
  deviceId: string;
  status: string;
  startedAt: string;
  endedAt: string | null;
  durationSec: number | null;
}

export interface UsageSummary {
  tenantId: string;
  period: string;
  totalSeconds: number;
  totalMinutes: number;
  totalSessions: number;
}

export interface InvoiceLine {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}
export interface Invoice {
  id: string;
  tenantId: string;
  invoiceNumber: string;
  period: string;
  totalAmount: number;
  currency: string;
  status: string;
  createdAt: string;
  lines: InvoiceLine[];
}
export interface TenantPlan {
  tenantId: string;
  tenantName: string;
  billingEmail: string;
  planType: PlanType;
  currency: string;
}

export interface ApiError {
  status?: number;
  code?: string;
  message?: string;
}
