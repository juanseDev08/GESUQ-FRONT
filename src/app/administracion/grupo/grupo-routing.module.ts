import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrupoComponent } from './grupo.component';

const routes: Routes = [{ path: '', component: GrupoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrupoRoutingModule { }
