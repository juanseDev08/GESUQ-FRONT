import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacultadProgramaComponent } from './facultad-programa.component';

const routes: Routes = [{ path: '', component: FacultadProgramaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacultadProgramaRoutingModule { }
