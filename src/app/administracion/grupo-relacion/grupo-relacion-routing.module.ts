import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrupoRelacionComponent } from './grupo-relacion.component';

const routes: Routes = [{ path: '', component: GrupoRelacionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrupoRelacionRoutingModule { }
