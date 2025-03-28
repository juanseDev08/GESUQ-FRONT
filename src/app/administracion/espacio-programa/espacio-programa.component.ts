import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-espacio-programa',
  templateUrl: './espacio-programa.component.html',
  styleUrl: './espacio-programa.component.scss',
  providers:[MessageService]
})
export class EspacioProgramaComponent implements OnInit {
  
  listaEspacioPrograma: any[] =[];

  constructor() {}

  ngOnInit(): void {
    // Initialization logic here
  }

  abrirCrearModal(){
  }

  eliminar(espacioPrograma: any){
    // Logic to delete the selected EspacioPrograma

  }
}
