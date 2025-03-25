import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioRoutingModule } from './inicio-routing.module';
import { InicioComponent } from './inicio.component';

import { TableModule } from 'primeng/table';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ComponentesModule } from "../../componentes/componentes.module";

@NgModule({
  declarations: [
    InicioComponent
  ],
  imports: [
    CommonModule,
    InicioRoutingModule,
    TableModule,
    DialogModule,
    ButtonModule,
    CalendarModule,
    FormsModule,
    DropdownModule,
    ComponentesModule
]
})
export class InicioModule { }
