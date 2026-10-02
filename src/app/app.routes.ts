import { Routes } from '@angular/router';

import { authGuard, adminGuard, guestGuard } from './core/guards';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login').then((m) => m.Login),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/register').then((m) => m.Register),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell').then((m) => m.Shell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard').then((m) => m.Dashboard) },
      { path: 'devices', loadComponent: () => import('./pages/devices').then((m) => m.Devices) },
      { path: 'sessions', loadComponent: () => import('./pages/sessions').then((m) => m.Sessions) },
      { path: 'usage', loadComponent: () => import('./pages/usage').then((m) => m.Usage) },
      { path: 'billing', loadComponent: () => import('./pages/billing').then((m) => m.Billing) },
      {
        path: 'users',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/users').then((m) => m.Users),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
