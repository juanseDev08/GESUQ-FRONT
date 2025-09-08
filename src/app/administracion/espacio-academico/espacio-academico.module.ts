import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EspacioAcademicoRoutingModule } from './espacio-academico-routing.module';
import { EspacioAcademicoComponent } from './espacio-academico.component';
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
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    EspacioAcademicoComponent
  ],
  imports: [
    CommonModule,
    EspacioAcademicoRoutingModule,
    TableModule,
    ToolbarModule,
    ToastModule,
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
    InputNumberModule,
    FileUploadModule,
    DropdownModule
  ]
})
export class EspacioAcademicoModule { }
