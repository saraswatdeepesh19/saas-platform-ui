import { bootstrapApplication } from '@angular/platform-browser';
import { initializeMonitoring } from './app/core/monitoring';
import { appConfig } from './app/app.config';
import { App } from './app/app';

initializeMonitoring();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
