import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: 'inicio', loadChildren: () => 
  import('./inicio/inicio.module').then(m => m.InicioModule) }, 
  { path: 'programa', loadChildren: () => import('./programa/programa.module').then(m => m.ProgramaModule) }, 
  { path: 'facultad', loadChildren: () => import('./facultad/facultad.module').then(m => m.FacultadModule) }, 
  { path: 'espacio-academico', loadChildren: () => import('./espacio-academico/espacio-academico.module').then(m => m.EspacioAcademicoModule) }, 
  { path: 'sede', loadChildren: () => import('./sede/sede.module').then(m => m.SedeModule) }, 
  { path: 'facultad-programa', loadChildren: () => import('./facultad-programa/facultad-programa.module').then(m => m.FacultadProgramaModule) },
  { path: 'usuario', loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule) },
  { path: 'mis-reservas', loadChildren: () => import('./mis-reservas/mis-reservas.module').then(m => m.MisReservasModule) },
  { path: 'espacio-programa', loadChildren: () => import('./espacio-programa/espacio-programa.module').then(m => m.EspacioProgramaModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
