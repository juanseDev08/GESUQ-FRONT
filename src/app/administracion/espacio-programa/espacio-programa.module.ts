import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EspacioProgramaRoutingModule } from './espacio-programa-routing.module';
import { EspacioProgramaComponent } from './espacio-programa.component';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [
    EspacioProgramaComponent
  ],
  imports: [
    CommonModule,
    EspacioProgramaRoutingModule,
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
export class EspacioProgramaModule { }
