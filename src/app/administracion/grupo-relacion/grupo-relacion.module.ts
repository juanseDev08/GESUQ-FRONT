import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrupoRelacionRoutingModule } from './grupo-relacion-routing.module';
import { GrupoRelacionComponent } from './grupo-relacion.component';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    GrupoRelacionComponent
  ],
  imports: [
    CommonModule,
    GrupoRelacionRoutingModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    CardModule,
    DropdownModule
  ]
})
export class GrupoRelacionModule { }
