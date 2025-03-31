import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EspacioSemestreRoutingModule } from './espacio-semestre-routing.module';
import { EspacioSemestreComponent } from './espacio-semestre.component';


@NgModule({
  declarations: [
    EspacioSemestreComponent
  ],
  imports: [
    CommonModule,
    EspacioSemestreRoutingModule
  ]
})
export class EspacioSemestreModule { }
