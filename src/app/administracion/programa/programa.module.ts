import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgramaRoutingModule } from './programa-routing.module';
import { ProgramaComponent } from './programa.component';


@NgModule({
  declarations: [
    ProgramaComponent
  ],
  imports: [
    CommonModule,
    ProgramaRoutingModule
  ]
})
export class ProgramaModule { }
