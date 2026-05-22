import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'tracker',
    loadComponent: () =>
      import('./pages/tracker/tracker.component').then(m => m.TrackerComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'tracker',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'tracker'
  }
];
