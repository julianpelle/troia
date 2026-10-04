import { Routes } from '@angular/router';
import { SitioComponent } from './sitio/sitio.component';

export const routes: Routes = [
  // página común: sitio para espectadores
  { path: '', pathMatch: 'full', component: SitioComponent },

  // versión del rodaje (se carga recién al entrar a /shot)
  {
    path: 'shot',
    loadComponent: () => import('./shot/shot.component').then((m) => m.ShotComponent)
  },

  { path: '**', redirectTo: '' }
];
