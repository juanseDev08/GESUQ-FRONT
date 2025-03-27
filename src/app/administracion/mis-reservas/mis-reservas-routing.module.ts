import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisReservasComponent } from './mis-reservas.component';

const routes: Routes = [{ path: '', component: MisReservasComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MisReservasRoutingModule { }
