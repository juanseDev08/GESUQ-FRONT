import { Component, OnInit, ViewChild } from '@angular/core';
import { Facultad } from '../../model/facultad-model';
import { Programa } from '../../model/programa-model';
import { FacultadPrograma, IFacultadPrograma } from '../../model/facultad-programa-model';
import { MessageService } from 'primeng/api';
import { StorageService } from '../../services/storage.service';
import { FacultadProgramaService } from '../../services/facultad-programa.service';
import { UtilConstants } from '../../util/util-constants';
import { FacultadService } from '../../services/facultad.service';
import { ProgramaService } from '../../services/programa.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-facultad-programa',
  templateUrl: './facultad-programa.component.html',
  styleUrl: './facultad-programa.component.scss',
  providers: [MessageService],
})
export class FacultadProgramaComponent implements OnInit {

  @ViewChild('tablaProgramas') tablaProgramas!: Table;

  listFacultades: Facultad[] = [];
  listProgramas: Programa[] = [];
  listaFacultadPrograma: IFacultadPrograma[] = [];
  newFacultadSolicitantes?: FacultadPrograma[];

  facultadSeleccionada?: Facultad;
  programaSeleccionados?: Programa[] = [];

  displayCrearFacultadPrograma: boolean = false;


  noDocumento?: string;

  fg = new FormGroup({
    facultad: new FormControl(0, [
      Validators.required
    ]),
    programa: new FormControl<Programa[]>([]),
  })

  constructor(
    private facultadServce: FacultadService,
    private programaService: ProgramaService,
    private storageService: StorageService,
    private messageService: MessageService,
    private facultadProgramaService: FacultadProgramaService
  ) { }

  ngOnInit(): void {
    this.listarFacultades();
    this.listarProgramas();
    this.listarFacultadPrograma();
    this.noDocumento = window.sessionStorage.getItem(UtilConstants.NUM_IDENTIFICACION)!;
  }

  listarFacultades() {
    this.facultadServce.listarFacultades().subscribe({
      next: (datafacultad) => {
        this.listFacultades = datafacultad;
      },
      error: (dataerror) => console.log(dataerror),
    });
  }

  listarProgramas() {
    this.programaService.listarProgramas().subscribe({
      next: (dataprograma) => {
        this.listProgramas = dataprograma.filter(
          (programa) => !this.listaFacultadPrograma.some(
            (facultadPrograma) => facultadPrograma.codPrograma === programa.codPrograma
          )
        );
        this.marcarProgramasSeleccionados();
      },
      error: (dataerror) => console.log(dataerror),
    });
  }

  listarFacultadPrograma(){
    this.facultadProgramaService.listarFacultadPrograma().subscribe({
      next:(datafacultadprograma)=>{
        this.listaFacultadPrograma=datafacultadprograma;
      },
      error: (dataerror) => console.log(dataerror),
    });
  }

  facultSeleccionada(event:any){
    if(event){
      this.facultadSeleccionada = this.listFacultades.find((facul) => facul.idFacultad === event)!;
      this.listarProgramas();
    }else{
      this.facultadSeleccionada = undefined;
    }
  }

  marcarProgramasSeleccionados() {
    this.programaSeleccionados = this.listProgramas.filter((programa) =>
      this.listaFacultadPrograma.some(facultadPrograma =>
        facultadPrograma.codPrograma === programa.codPrograma));
  }


  crearFacultadSolicitante() {

    if (this.programaSeleccionados && this.programaSeleccionados.length > 0) {

      if (!this.newFacultadSolicitantes) {
        this.newFacultadSolicitantes = [];
      }

      const nuevosRegistros = this.programaSeleccionados.map(i => ({
        codPrograma: i.codPrograma,
        nombrePrograma: i.nombre,
        idFacultad: this.facultadSeleccionada?.idFacultad,
        nombreFacultad: this.facultadSeleccionada?.nombreFacultad,
        idUsuarioCreacion: this.noDocumento
      }));     

      this.newFacultadSolicitantes.push(...nuevosRegistros);
      this.facultadProgramaService.crearFacultadPrograma(this.newFacultadSolicitantes).subscribe({
        next: (datalistarequipo) => {
          this.messageService.add({
            severity: 'success',
            summary: 'CONFIRMACIÓN',
            detail: 'registro creado con éxito',
          });
          this.cerrarCrearModal();
          this.listarFacultadPrograma();
        },

        error: (dataerror) => {
          console.error(dataerror);
          
        },
      })

    } else {
      this.eliminarFacultadPrograma(this.programaSeleccionados!, this.facultadSeleccionada!);
    }

  }
  eliminarFacultadPrograma(seleccionados: Programa[], facultSelect: Facultad) {
    this.listaFacultadPrograma.forEach((i) => {
      if (!seleccionados?.some(select => select.codPrograma === i.codPrograma
      ) && i.idFacultad == facultSelect.idFacultad) {

        this.facultadProgramaService.eliminarFacultadPrograma(i.codPrograma!).subscribe({
          next: (datalistarequipo) => {
            this.listarFacultadPrograma();
            this.cerrarCrearModal();
          },
          error: (dataerror) => {
            console.error(dataerror);

          },
        })

      }
    })

  }


  //---- Abrir modales ----//
  abrirCrearModal(): void {
    this.fg.reset();
    this.newFacultadSolicitantes = [];
    this.displayCrearFacultadPrograma = true;
  }

  limpiarListaTabla(): void {
    this.listProgramas = [];
    this.programaSeleccionados = [];
  }

  cerrarCrearModal(): void {
    this.listProgramas = [];
    this.programaSeleccionados = [];
    this.facultadSeleccionada = undefined;
    this.displayCrearFacultadPrograma = false;
  }

}
