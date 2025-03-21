import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: 'inicio', loadChildren: () => 
  import('./inicio/inicio.module').then(m => m.InicioModule) }, 
  { path: 'programa', loadChildren: () => import('./programa/programa.module').then(m => m.ProgramaModule) }, 
  { path: 'facultad', loadChildren: () => import('./facultad/facultad.module').then(m => m.FacultadModule) }, 
  { path: 'espacio-academico', loadChildren: () => import('./espacio-academico/espacio-academico.module').then(m => m.EspacioAcademicoModule) }, 
  { path: 'sede', loadChildren: () => import('./sede/sede.module').then(m => m.SedeModule) }, 
  { path: 'facultad-programa', loadChildren: () => import('./facultad-programa/facultad-programa.module').then(m => m.FacultadProgramaModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
