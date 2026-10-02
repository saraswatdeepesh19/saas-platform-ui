import * as Sentry from '@sentry/angular';

declare global {
  interface Window {
    __SAAS_PLATFORM_CONFIG__?: {
      sentryDsn?: string;
    };
  }
}

export function initializeMonitoring(): void {
  const dsn = window.__SAAS_PLATFORM_CONFIG__?.sentryDsn;
  if (!dsn) return;

  Sentry.init({
    dsn,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.1,
    tracePropagationTargets: [/\/api(?:\/|$)/],
  });
}