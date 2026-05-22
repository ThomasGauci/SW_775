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
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'import',
        loadComponent: () =>
          import('./pages/import/import.component').then(m => m.ImportComponent)
      },
      {
        path: 'monsters',
        loadComponent: () =>
          import('./pages/monsters/monsters.component').then(m => m.MonstersComponent)
      },
      {
        path: 'siege',
        loadComponent: () =>
          import('./pages/tracker/tracker.component').then(m => m.TrackerComponent)
      },
      {
        path: 'runes',
        loadComponent: () =>
          import('./pages/runes/runes.component').then(m => m.RunesComponent)
      },
      {
        path: 'artifacts',
        loadComponent: () =>
          import('./pages/artifacts/artifacts.component').then(m => m.ArtifactsComponent)
      },
      {
        path: '',
        redirectTo: 'siege',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
