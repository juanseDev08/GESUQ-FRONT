import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FacultadService } from '../../services/facultad.service';
import { Facultad, IFacultad } from '../../model/facultad-model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { StorageService } from '../../services/storage.service';
import { UtilConstants } from '../../util/util-constants';
import { Utilities } from '../../util/utilities';

@Component({
  selector: 'app-facultad',
  templateUrl: './facultad.component.html',
  styleUrl: './facultad.component.scss',
  providers: [MessageService],
})
export class FacultadComponent implements OnInit {

  listFacultad: IFacultad[]=[];
  facultad?: IFacultad;
  newFacultad: Facultad = new Facultad();

  displayCrearFacultad: boolean = false;
  displayEditarFacultad: boolean = false;

  noDocumento?:string;

  mensaje = Utilities;

  fg= new FormGroup({
    nombre: new FormControl('', [
      Validators.required
    ]),
  });

  constructor(
    private facultadService: FacultadService,
    private messageService: MessageService,
  ){}

  ngOnInit(): void {
    this.listarFacultades();
    this.noDocumento = window.sessionStorage.getItem(UtilConstants.NUM_IDENTIFICACION)!;
  }


  //----- Metodos que permiten listar 

  listarFacultades():void{
    this.facultadService.listarFacultades().subscribe({
      next:(datafacultad) =>{
        this.listFacultad = datafacultad;
      },
      error:(dataerror)=> console.log(dataerror),
    });
  }



abrirCrearModal(){
  this.fg.reset();
  this.newFacultad= new Facultad();
  this.displayCrearFacultad = true;
}

abrirEditarModal(facultad : Facultad){
  this.fg.reset();
  this.newFacultad ={...facultad };
  this.fg?.get('nombre')?.setValue(facultad.nombreFacultad!);
  this.displayEditarFacultad=true;
}

// -- Metodo de crear -- //
crearFacultad(){
  this.newFacultad.nombreFacultad = this.fg?.get('nombre')?.value!;
  this.newFacultad.idUsuarioCreacion= this.noDocumento;
  if(this.fg.valid){
    this.facultadService.crearFacultad(this.newFacultad).subscribe({
      next:(datafacultad)=>{
        this.messageService.add({
          severity: 'success',
          summary: 'CONFIRMACIÓN',
          detail: 'Registro creado con éxito',
        });
        this.facultad = datafacultad;
        this.listarFacultades();
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
    this.displayCrearFacultad=false;
  }else{
    this.mensaje.mensajeError("Error al crear","Es necesario completar todos los campos del formulario para crear.");
  }

}

editarFacultad(): void{
  this.newFacultad.nombreFacultad = this.fg?.get('nombre')?.value!;
  this.newFacultad.idUsuarioModificacion = this.noDocumento;
  if(this.fg.valid){
    this.facultadService.actualizarFacultad(this.newFacultad).subscribe({
      next:(datafacultad)=>{
        this.messageService.add({
          severity: 'success',
          summary: 'CONFIRMACIÓN',
          detail: 'Registro actualizado con éxito',
        }); 
        this.listFacultad != datafacultad;
        this.listarFacultades();
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

  //----cerrar modales--//
  cerrarCrearModal(): void {
    this.displayCrearFacultad = false;
  }

  cerrarEditarModal(): void {
    this.displayEditarFacultad = false;
  }

  getActivoValue(): boolean {
    return !!this.fg?.get('activo')?.value;
  }
  getSeverity(esActivo: boolean): 'success' | 'danger' {
    return esActivo ? 'success' : 'danger';
  }
}
