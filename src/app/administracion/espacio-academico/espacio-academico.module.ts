import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EspacioAcademicoRoutingModule } from './espacio-academico-routing.module';
import { EspacioAcademicoComponent } from './espacio-academico.component';


@NgModule({
  declarations: [
    EspacioAcademicoComponent
  ],
  imports: [
    CommonModule,
    EspacioAcademicoRoutingModule
  ]
})
export class EspacioAcademicoModule { }
