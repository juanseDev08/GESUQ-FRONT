import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgramaService } from '../../services/programa.service';
import { MessageService } from 'primeng/api';
import { IPrograma, Programa } from '../../model/programa-model';
import { Utilities } from '../../util/utilities';
import { UtilConstants } from '../../util/util-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-programa',
  templateUrl: './programa.component.html',
  styleUrl: './programa.component.scss',
  providers: [MessageService],
})
export class ProgramaComponent implements OnInit {

  listPrograma: IPrograma[]=[];
  programa ?: IPrograma;
  newPrograma: Programa = new Programa();

  displayCrearPrograma: boolean = false;
  displayEditarPrograma: boolean = false;

  filteredOptions?: any[];
  selectedOption: any = null;

  noDocumento?:string;
  
  mensaje = Utilities;

  
  listaOpciones = [
    {
      icono: 'pi pi-pen-to-square',
      nombre: 'Editar',
      tooltip: 'Abrir modal para editar el programa',
  
    },
    {
      icono: 'pi pi-trash',
      nombre: 'Eliminar',
    }
  ];

  constructor(
    private programaService : ProgramaService,
    private messageService: MessageService, 
  ){}

  ngOnInit(): void {
    this.listarProgramas();
    this.noDocumento = window.sessionStorage.getItem(UtilConstants.NUM_IDENTIFICACION)!;
  }

  fg = new FormGroup({
    codPrograma: new FormControl('',[
      Validators.required,
    ]),
    nombre: new FormControl('', [
      Validators.required,
    ]),
  })

  abrirModal(opcion: any, programa: IPrograma): void {
      switch (opcion.nombre) {
        case 'Editar':
          this.abrirEditarModal(programa);
          break;
        case 'Eliminar':
          this.eliminar(programa);
          break;
  
        default:
          break;
      }
      setTimeout(() => {
        this.selectedOption = null;
      }, 0);
    } 
  
  
  //----- Metodos que permiten listar 
  listarProgramas():void{
    this.listPrograma =[];
    this.programaService.listarProgramas().subscribe({
      next:(dataprograma) =>{
        this.listPrograma = dataprograma;
      },
      error:(dataerror)=> console.log(dataerror),
    })
  }

  abrirCrearModal(){
    this.fg.reset();
    this.newPrograma= new Programa();
    this.displayCrearPrograma = true;
  }
  
  abrirEditarModal(programa : Programa){
    this.fg.reset();
    this.newPrograma ={...programa };
    this.fg?.get('codPrograma')?.setValue(programa.codPrograma!);
    this.fg?.get('nombre')?.setValue(programa.nombre!);
    this.displayEditarPrograma=true;
  }

  // -- Metodo de crear -- //
  crearPrograma(){
    this.newPrograma.codPrograma =  this.fg?.get('codPrograma')?.value!;
    this.newPrograma.nombre =  this.fg?.get('nombre')?.value!;
    this.newPrograma.idUsuarioCreacion = this.noDocumento;
    if(this.fg.valid){
      this.programaService.crearPrograma(this.newPrograma).subscribe({
        next:(dataprograma) =>{
          this.messageService.add({
            severity: 'success',
            summary: 'CONFIRMACIÓN',
            detail: 'Registro creado con éxito',
          });
          this.programa = dataprograma;
          this.listarProgramas();
          this.cerrarCrearModal();
        },
        error: (dataerror) => {
          this.messageService.add({
            severity: 'error',
            summary: 'ERROR',
            detail: 'El registro ingresado ya existe',
          });
        },
      });
      this.displayCrearPrograma=false;
    }else{
      this.mensaje.mensajeError("Error al crear","Es necesario completar todos los campos del formulario para crear.");
    }
  }

  editarPrograma(): void {
    this.newPrograma.codPrograma = this.fg?.get('codPrograma')?.value!;
    this.newPrograma.nombre =  this.fg?.get('nombre')?.value!;
    this.newPrograma.idUsuarioModificacion = this.noDocumento;
    if(this.fg.valid){
      this.programaService.actualizarPrograma(this.newPrograma).subscribe({
        next:(dataPrograma)=>{
          this.messageService.add({
            severity: 'success',
            summary: 'CONFIRMACIÓN',
            detail: 'Registro actualizado con éxito',
          });
          this.listPrograma != dataPrograma;
          this.listarProgramas();
          this.cerrarEditarModal();
        },
        error: (dataerror) => {
          this.messageService.add({
            severity: 'error',
            summary: 'ERROR',
            detail: 'El registro ingresado ya existe',
          });
        },
      });
    }else{
      this.mensaje.mensajeError("Error al editar","Es necesario completar todos los campos del formulario para editar.");
    }
  }

  eliminar(programa :IPrograma){
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará permanentemente el programa. ¿Deseas continuar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#26670f",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, eliminar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.programaService.eliminarPrograma(programa.idPrograma!).subscribe({
            next:(dataprograma)=>{
              this.listarProgramas();
            }
          });
        }
      });
    }

 //----cerrar modales--//
  cerrarCrearModal(): void {
    this.displayCrearPrograma = false;
  }

  cerrarEditarModal(): void {
    this.displayEditarPrograma = false;
  }

}
