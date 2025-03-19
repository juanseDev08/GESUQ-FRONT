import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
  
  path: 'administracion',
  loadChildren: () =>
    import('./administracion/administracion.module').then(m => m.AdministracionModule),
},
{
  path: 'inicio', redirectTo: 'administracion/inicio', pathMatch: 'full'
},
{ path: 'login', component: LoginComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
