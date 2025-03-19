import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacultadRoutingModule } from './facultad-routing.module';
import { FacultadComponent } from './facultad.component';


@NgModule({
  declarations: [
    FacultadComponent
  ],
  imports: [
    CommonModule,
    FacultadRoutingModule
  ]
})
export class FacultadModule { }
