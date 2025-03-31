import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EspacioSemestreComponent } from './espacio-semestre.component';

const routes: Routes = [{ path: '', component: EspacioSemestreComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EspacioSemestreRoutingModule { }
