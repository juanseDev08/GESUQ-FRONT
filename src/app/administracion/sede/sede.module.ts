import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SedeRoutingModule } from './sede-routing.module';
import { SedeComponent } from './sede.component';


@NgModule({
  declarations: [
    SedeComponent
  ],
  imports: [
    CommonModule,
    SedeRoutingModule
  ]
})
export class SedeModule { }
