import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { authMatch } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'administracion',
    loadChildren: () =>
      import('./administracion/administracion.module').then(m => m.AdministracionModule),
    canMatch: [authMatch]
  },
  {
    path: 'inicio',
    redirectTo: 'administracion/inicio',
    pathMatch: 'full',
    canMatch: [authMatch]
  },
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
