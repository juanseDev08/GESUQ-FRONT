import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EspacioProgramaComponent } from './espacio-programa.component';

const routes: Routes = [{ path: '', component: EspacioProgramaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EspacioProgramaRoutingModule { }
