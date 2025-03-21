import { Component, OnInit } from '@angular/core';
import { EspacioAcademicoService } from '../../services/espacio-academico.service';
import { MessageService } from 'primeng/api';
import { EspacioAcademico, IEspacioAcademico } from '../../model/espacio-academico';
import { Utilities } from '../../util/utilities';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilConstants } from '../../util/util-constants';

@Component({
  selector: 'app-espacio-academico',
  templateUrl: './espacio-academico.component.html',
  styleUrl: './espacio-academico.component.scss',
  providers: [MessageService],
})
export class EspacioAcademicoComponent implements OnInit {
  listEspacioAcademico: IEspacioAcademico[] = [];
  espacioAcademico?: IEspacioAcademico;
  newEspacioAcademico: EspacioAcademico = new EspacioAcademico();

  displayCrearEspacioAcademico: boolean = false;
  displayEditarEspacioAcademico: boolean = false;

  noDocumento?: string;

  mensaje = Utilities;

  fg = new FormGroup({
    nombre: new FormControl('', [
      Validators.required
    ]),
    semestre: new FormControl(0, [
      Validators.required
    ]),
    descripcion: new FormControl('', [
      Validators.required
    ]),

  });

  constructor(
    private espacioAcademicoService: EspacioAcademicoService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {

    this.listarEspacioAcademico();
    this.noDocumento = window.sessionStorage.getItem(UtilConstants.NUM_IDENTIFICACION)!;
  }

  //----- Metodos que permiten listar 
  listarEspacioAcademico(): void {
    this.espacioAcademicoService.listarEspaciosAcademicos().subscribe({
      next: (dataespacioacademico) => {
        this.listEspacioAcademico = dataespacioacademico;
      },
      error: (dataerror) => console.log(dataerror),
    });
  }

abrirCrearModal(){
  this.fg.reset();
  this.newEspacioAcademico= new EspacioAcademico();
  this.displayCrearEspacioAcademico = true;
}

abrirEditarModal(espacioAcademico : EspacioAcademico){
  this.fg.reset();
  this.newEspacioAcademico ={...espacioAcademico };
  this.fg?.get('nombre')?.setValue(espacioAcademico.nombre!);
  this.fg?.get('semestre')?.setValue(espacioAcademico.semestre!);
  this.fg?.get('descripcion')?.setValue(espacioAcademico.descripcion!);
  this.displayEditarEspacioAcademico=true;
}

// -- Metodo de crear -- //

crearEspacoAcademico(){
  this.newEspacioAcademico.nombre =  this.fg?.get('nombre')?.value!;
  this.newEspacioAcademico.semestre =  this.fg?.get('semestre')?.value!;
  this.newEspacioAcademico.descripcion = this.fg?.get('descripcion')?.value!;
  this.newEspacioAcademico.idUsuarioCreacion = this.noDocumento;
  if(this.fg.valid){
    this.espacioAcademicoService.crearEspacioAcademico(this.newEspacioAcademico).subscribe({
      next:(dataespacioacademico) =>{
        this.messageService.add({
          severity: 'success',
          summary: 'CONFIRMACIÓN',
          detail: 'Registro creado con éxito',
        });
        this.espacioAcademico = dataespacioacademico;
        this.listarEspacioAcademico();
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
    this.displayCrearEspacioAcademico= false;
  }else{
    this.mensaje.mensajeError("Error al crear","Es necesario completar todos los campos del formulario para crear.");
  }
}


editarEspacioAcademico(){
  this.newEspacioAcademico.nombre =  this.fg?.get('nombre')?.value!;
  this.newEspacioAcademico.semestre =  this.fg?.get('semestre')?.value!;
  this.newEspacioAcademico.descripcion = this.fg?.get('descripcion')?.value!;
  this.newEspacioAcademico.idUsuarioModificacion = this.noDocumento;
  if(this.fg.valid){
    this.espacioAcademicoService.actualizarEspacioAcademico(this.newEspacioAcademico).subscribe({
      next:(dataespacioacademico) =>{
          this.messageService.add({
            severity: 'success',
            summary: 'CONFIRMACIÓN',
            detail: 'Registro actualizado con éxito',
          }); 
          this.listEspacioAcademico != dataespacioacademico;
          this.listarEspacioAcademico();
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
  this.displayCrearEspacioAcademico = false;
}

cerrarEditarModal(): void {
  this.displayEditarEspacioAcademico = false;
}

}
