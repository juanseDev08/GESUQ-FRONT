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
import Swal from 'sweetalert2';

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
    private facultadService: FacultadService,
    private programaService: ProgramaService,
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
    this.facultadService.listarFacultades().subscribe({
      next: (datafacultad) => {
        this.listFacultades = datafacultad;
      },
      error: (dataerror) => console.log(dataerror),
    });
  }

  listarProgramas() {
    this.programaService.listarProgramas().subscribe({
      next: (dataprograma) => {
        this.listProgramas =  dataprograma.filter(
          (programa) => !this.listaFacultadPrograma.some(
            (facultadPrograma) => facultadPrograma.programa?.codPrograma === programa.codPrograma
          )
        );
        this.marcarProgramasSeleccionados();
      },
      error: (dataerror) => console.log(dataerror),
    });
  }

  listarFacultadPrograma(){
    this.listaFacultadPrograma =[]
    this.facultadProgramaService.listarFacultadPrograma().subscribe({
      next:(datafacultadprograma)=>{
          this.listaFacultadPrograma=datafacultadprograma;
      },
      error: (dataerror) =>console.error(dataerror),
    });
  }

  facultSeleccionada(event:any){

    if(event){
      this.facultadSeleccionada = this.listFacultades.find((facul) => facul.idFacultad === event)!;
    
      this.listarProgramas();
    }else{
      this.facultadSeleccionada = undefined
    }
  }

  marcarProgramasSeleccionados() {
    this.programaSeleccionados = this.listProgramas.filter((programa) =>
      this.listaFacultadPrograma.some(facultadPrograma =>
        facultadPrograma.programa!.codPrograma === programa.codPrograma));
  }


  crearFacultadSolicitante() {

    if (this.programaSeleccionados && this.programaSeleccionados.length > 0) {

      if (!this.newFacultadSolicitantes) {
        this.newFacultadSolicitantes = [];
      }

      let nuevosRegistros: IFacultadPrograma[] = this.programaSeleccionados.map(i => ({
        programa: {idPrograma: i.idPrograma, codPrograma: i.codPrograma ,nombre: i.nombre  }, // Se debe enviar el código del programa
        facultad: { idFacultad: this.facultadSeleccionada!.idFacultad, nombreFacultad: this.facultadSeleccionada?.nombreFacultad  }, // Se debe enviar el código de la facultad
        idUsuarioCreacion: this.noDocumento
      }));     

      let newLista = [...this.listaFacultadPrograma,...nuevosRegistros];
      
      this.facultadProgramaService.crearFacultadPrograma(newLista).subscribe({
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
      if (!seleccionados?.some(select => select.codPrograma === i.programa?.codPrograma
      ) && i.facultad?.idFacultad == facultSelect.idFacultad) {

        this.facultadProgramaService.eliminarFacultadPrograma(i.programa!.codPrograma!).subscribe({
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

  eliminar(event:any){
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará permanentemente esta relación. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#26670f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar"
    }).then((result) => {
      if(result.isConfirmed){
        this.facultadProgramaService.eliminarFacultadProgramaporid(event.idFacultadPrograma).subscribe({
          next:()=>{
            Swal.fire({
              title: "¡Eliminación exitosa!",
              text: "El dato seleccionado ha sido eliminado correctamente.",
              icon: "success"
            });
            this.listarFacultadPrograma();
          }
        });
      }
    });
    
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
