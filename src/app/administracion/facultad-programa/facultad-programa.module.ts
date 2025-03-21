import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacultadProgramaRoutingModule } from './facultad-programa-routing.module';
import { FacultadProgramaComponent } from './facultad-programa.component';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [
    FacultadProgramaComponent
  ],
  imports: [
    CommonModule,
    FacultadProgramaRoutingModule,
    TableModule,
    ToolbarModule,
    ToastModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    TooltipModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    CardModule,
    DropdownModule
  ]
})
export class FacultadProgramaModule { }
