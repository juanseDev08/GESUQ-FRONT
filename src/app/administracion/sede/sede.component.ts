import { Component, OnInit, ViewChild } from '@angular/core';
import { Isede, Sede } from '../../model/sede-model';
import { Utilities } from '../../util/utilities';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SedeService } from '../../services/sede.service';
import { MessageService } from 'primeng/api';
import { UtilConstants } from '../../util/util-constants';

@Component({
  selector: 'app-sede',
  templateUrl: './sede.component.html',
  styleUrl: './sede.component.scss',
  providers: [MessageService],
})
export class SedeComponent implements OnInit {

  listSedes: Isede[] = [];
  sede?: Isede;
  newSede: Sede = new Sede();

  displayCrearSede: boolean = false;
  displayEditarSede: boolean = false;

  noDocumento?: string;

  mensaje = Utilities;

  fg = new FormGroup({

    nombre: new FormControl('', [
      Validators.required
    ]),
    ubicacion: new FormControl('', [
      Validators.required
    ]),
  });

  constructor(
    private sedeService: SedeService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.listarSedes();
    this.noDocumento = window.sessionStorage.getItem(UtilConstants.NUM_IDENTIFICACION)!;
  }

  //----- Metodos que permiten listar 

  listarSedes(): void {
    this.sedeService.listarSedes().subscribe({
      next: (datasede) => {
        this.listSedes = datasede;
      },
      error: (error) => console.error('Error al listar sedes:', error),
    });
  }

  abrirCrearModal() {
    this.fg.reset();
    this.newSede = new Sede();
    this.displayCrearSede = true;
  }

  abrirEditarModal(sede: Sede) {
    this.fg.reset();
    this.newSede = { ...sede };
    this.fg?.get('nombre')?.setValue(sede.nombreSede!);
    this.fg?.get('ubicacion')?.setValue(sede.ubicacion!);
    this.displayEditarSede = true;

  }
  // -- Metodo de crear -- //
  crearSede() {
    this.newSede.nombreSede = this.fg?.get('nombre')?.value!;
    this.newSede.ubicacion = this.fg?.get('ubicacion')?.value!;
    this.newSede.idUsuarioCreacion = this.noDocumento;
    if (this.fg.valid) {
      this.sedeService.crearSede(this.newSede).subscribe({
        next: (datasede) => {
          this.messageService.add({
            severity: 'success',
            summary: 'CONFIRMACION',
            detail: 'Registro creado con exito',
          });
          this.sede = datasede;
          this.listarSedes();
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
      this.displayCrearSede = false;
    } else {
      this.mensaje.mensajeError("Error al crear", "Es necesario completar todos los campos del formulario para crear.")
    }

  }

  editarSede(): void {
    this.newSede.nombreSede = this.fg?.get('nombre')?.value!;
    this.newSede.ubicacion = this.fg?.get('ubicacion')?.value!;
    this.newSede.idUsuarioModificacion = this.noDocumento;
    if (this.fg.valid) {
      this.sedeService.actualizarSede(this.newSede).subscribe({
        next:(datasede)=>{
          this.messageService.add({
            severity:'success',
            summary:'CONFIRMACION',
            detail:'Registro actualizado con exito',
          });
          this.listSedes != datasede;
          this.listarSedes();
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
  //----cerrar modales--//
  cerrarCrearModal(): void {
    this.displayCrearSede = false;
  }

  cerrarEditarModal(): void {
    this.displayEditarSede = false;

  }


}
