import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import * as Sentry from '@sentry/angular';

export const performanceInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes('/api/')) return next(req);

  const resource = new URL(req.url, window.location.origin).pathname.split('/')[2] || 'unknown';
  const span = Sentry.startInactiveSpan({
    name: `${req.method} /api/${resource}`,
    op: 'http.client',
    attributes: { 'http.request.method': req.method },
  });

  return next(req).pipe(finalize(() => span.end()));
};