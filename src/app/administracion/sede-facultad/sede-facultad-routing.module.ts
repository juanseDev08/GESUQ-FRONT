import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SedeFacultadComponent } from './sede-facultad.component';

const routes: Routes = [{ path: '', component: SedeFacultadComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SedeFacultadRoutingModule { }
