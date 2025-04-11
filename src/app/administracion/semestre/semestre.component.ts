import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ISemestre, Semestre } from '../../model/semestre';
import { Utilities } from '../../util/utilities';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SemestreService } from '../../services/semestre.service';
import { UtilConstants } from '../../util/util-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-semestre',
  templateUrl: './semestre.component.html',
  styleUrl: './semestre.component.scss',
  providers: [MessageService],
})
export class SemestreComponent implements OnInit{

  listSemestre :ISemestre []=[];
  semestre ?: ISemestre;
  newSemestre : Semestre = new Semestre();

  displayCrearSemestre: boolean = false;
  displayEditarSemestre: boolean = false;

  filteredOptions?: any[];
  selectedOption: any = null;

    noDocumento?: string;
  
    mensaje = Utilities;
/*     listaOpciones = [
      {
        icono: 'pi pi-pen-to-square',
        nombre: 'Editar',
        tooltip: 'Abrir modal para editar la sede',
      },
      {
        icono: 'pi pi-trash',
        nombre: 'Eliminar',
      }
    ]; */
  

      fg = new FormGroup({
        noSemestre: new FormControl(0, [
          Validators.required
        ]),
        descripcion: new FormControl('', [
          Validators.required
        ]),
      });
    
  constructor(
    private semestreService : SemestreService,
    private messageService: MessageService,
  ){}
  
  ngOnInit(): void {
    this.listarSemestres()
    this.noDocumento = window.sessionStorage.getItem(UtilConstants.NUM_IDENTIFICACION)!;
  }

  //--- metodos de listar  
  listarSemestres(){
    this.listSemestre =[];
    this.semestreService.listarSemestre().subscribe({
      next: (datasemestre)=>{
        this.listSemestre = datasemestre;
      },
      error: (error) => console.error('Error al listar semestres:', error) 
    });
  }

  abrirModal(opcion: any, semestre: ISemestre): void {
     switch (opcion.nombre) {
       case 'Editar':
         this.abrirEditarModal(semestre);
         break;
       case 'Eliminar':
         this.eliminar(semestre);
         break;
 
       default:
         break;
     }
     setTimeout(() => {
       this.selectedOption = null;
     }, 0);
   } 

     abrirCrearModal() {
       this.fg.reset();
       this.newSemestre = new Semestre();
       this.displayCrearSemestre = true;
     }

     abrirEditarModal(semestre: Semestre) {
       this.fg.reset();
       this.newSemestre = { ...semestre };
       this.fg?.get('noSemestre')?.setValue(semestre.noSemestre!);
       this.fg?.get('descripcion')?.setValue(semestre.descripcion!);
       this.displayEditarSemestre = true;
 
     }

     // -- Metodo de crear -- //
  crearSemestre() {
    this.newSemestre.noSemestre= this.fg?.get('noSemestre')?.value!;
    this.newSemestre.descripcion = this.fg?.get('descripcion')?.value!;
    this.newSemestre.idUsuarioCreacion = this.noDocumento;
    if (this.fg.valid) {
      this.semestreService.crearSemestre(this.newSemestre).subscribe({
        next: (datasemestre) => {
          this.messageService.add({
            severity: 'success',
            summary: 'CONFIRMACION',
            detail: 'Registro creado con exito',
          });
          this.semestre = datasemestre;
          this.listarSemestres();
          this.cerrarCrearModal();
        },
        error: (dataerror) => {
          this.messageService.add({
            severity: 'error',
            summary: 'ERROR',
            detail: 'El registro ingresado ya existe'
          });
        },
      });
      this.displayCrearSemestre = false;
    } else {
      this.mensaje.mensajeError("Error al crear", "Es necesario completar todos los campos del formulario para crear.")
    }

  }

/*  editarSede(): void {
  this.newSemestre.noSemestre= this.fg?.get('noSemestre')?.value!;
  this.newSemestre.descripcion = this.fg?.get('descripcion')?.value!;
  this.newSemestre.idUsuarioCreacion = this.noDocumento;
    if (this.fg.valid) {
      this.semestreService.actualizarSemestre(this.newSemestre).subscribe({
        next:(datasemestre)=>{
          this.messageService.add({
            severity:'success',
            summary:'CONFIRMACION',
            detail:'Registro actualizado con exito',
          });
          this.listSemestre != datasemestre;
          this.listarSemestres();
          this.cerrarEditarModal();
        },
        error:(dataerror)=>{
          this.messageService.add({
            severity:'error',
            summary:'ERROR',
            detail:'El registro ingresado ya existe'
          });
        },
      });
    } else {
      this.mensaje.mensajeError("Error al editar", "Es necesario completar todos los campos del formulario para editar.");
    }
  }
  */
  eliminar(semestre :ISemestre){
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará permanentemente el semestre. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#26670f",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        
      this.semestreService.eliminarSemestre(semestre.idSemestre!).subscribe({
        next : (datasemestre)=>{
          this.listarSemestres();
        }
      });
      }
    });
  }
    //----cerrar modales--//
    cerrarCrearModal(): void {
      this.displayCrearSemestre = false;
    }
  
    cerrarEditarModal(): void {
      this.displayEditarSemestre = false;
  
    }
  

}
