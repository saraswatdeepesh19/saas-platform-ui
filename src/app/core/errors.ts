import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from './models';

export function errorMessage(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) return 'Cannot reach the gateway. Is the backend running on :8080?';
    const body = err.error as ApiError | null;
    if (body?.message) return body.message;
    if (err.status === 403) return 'You do not have permission for this action.';
    if (err.status === 503) return 'Service temporarily unavailable. Please retry shortly.';
    return `Request failed (${err.status}).`;
  }
  return 'Unexpected error.';
}

export function currentPeriod(date = new Date()): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}
