import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacultadProgramaRoutingModule } from './facultad-programa-routing.module';
import { FacultadProgramaComponent } from './facultad-programa.component';


@NgModule({
  declarations: [
    FacultadProgramaComponent
  ],
  imports: [
    CommonModule,
    FacultadProgramaRoutingModule
  ]
})
export class FacultadProgramaModule { }
