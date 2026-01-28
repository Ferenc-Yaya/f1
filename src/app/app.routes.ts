import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { RegistroForm } from './registro-form/registro-form';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'home', component: Home },
  { path: 'registro', component: RegistroForm },
  { path: 'registro/:id', component: RegistroForm },
];
