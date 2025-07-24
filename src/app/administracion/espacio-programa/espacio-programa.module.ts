import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EspacioProgramaRoutingModule } from './espacio-programa-routing.module';
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
import { CheckboxModule } from 'primeng/checkbox';
import { EspacioProgramaComponent } from './espacio-programa.component';

@NgModule({
  declarations: [EspacioProgramaComponent],
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
  ],
})
export class EspacioProgramaModule {}
