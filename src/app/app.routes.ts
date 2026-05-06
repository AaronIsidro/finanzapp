import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Transacciones } from './pages/transacciones/transacciones';
import { Categorias } from './pages/categorias/categorias';
import { Divisas } from './pages/divisas/divisas';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'transacciones', component: Transacciones, canActivate: [authGuard] },
  { path: 'categorias', component: Categorias, canActivate: [authGuard] },
  { path: 'divisas', component: Divisas, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' }
];
