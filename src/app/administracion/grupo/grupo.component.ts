


import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Grupo, IGrupo } from '../../model/grupo-model';
import { Utilities } from '../../util/utilities';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GrupoService } from '../../services/grupo.service';
import { UtilConstants } from '../../util/util-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrl: './grupo.component.scss',
  providers: [MessageService],
})
export class GrupoComponent implements OnInit {


  listGrupos: IGrupo[] = [];
  grupo?: IGrupo;
  newGrupo: Grupo = new Grupo();

  displayCrearGrupo: boolean = false;
  displayEditarGrupo: boolean = false;

  filteredOptions?: any[];
  selectedOption: any = null;

  noDocumento?: string

  mensaje = Utilities;

  listaOpciones = [
    {
      icono: 'pi pi-pencil',
      nombre: 'Editar',
      tooltip: 'Abrir modal para editar el grupo',
    },
    {
      icono: 'pi pi-trash',
      nombre: 'Eliminar',
    }
  ];

  fg = new FormGroup({

    nombreGrupo: new FormControl('', [
      Validators.required
    ]),
    semestre: new FormControl('', [
      Validators.required
    ]),

  });

  constructor(
    private GrupoService: GrupoService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.listarGrupos();
    this.noDocumento = window.sessionStorage.getItem(UtilConstants.NUM_IDENTIFICACION)!;
  }

  //----- Metodos que permiten listar 

  listarGrupos(): void {
    this.listGrupos = [];
    this.GrupoService.listarGrupos().subscribe({
      next: (datagrupo) => {
        this.listGrupos = datagrupo;
      },
      error: (error) => console.error('Error al listar grupos:', error)
    });
  }

  abrirModal(opcion: any, grupo: IGrupo): void {
    switch (opcion.nombre) {
      case 'Editar':
        this.abrirEditarModal(grupo);
        break;
      case 'Eliminar':
        this.eliminarGrupo(grupo);
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
    this.newGrupo = new Grupo();
    this.displayCrearGrupo = true;
  }

  abrirEditarModal(grupo: Grupo) {
    this.fg.reset();
    this.newGrupo = { ...grupo };
    this.fg?.get('nombreGrupo')?.setValue(grupo.nombreGrupo!);
    this.fg?.get('semestre')?.setValue(grupo.semestre!);
    this.displayEditarGrupo = true;

  }

  crearGrupo() {
    this.newGrupo.nombreGrupo = this.fg?.get('nombreGrupo')?.value!;
    this.newGrupo.semestre = this.fg?.get('semestre')?.value!;
    this.newGrupo.idUsuarioCreacion = this.noDocumento;
    if (this.fg.valid) {
      this.GrupoService.crearGrupo(this.newGrupo).subscribe({
        next: (datagrupo) => {
          this.messageService.add({
            severity: "success",
            summary: "CONFIRMACION",
            detail: "Registro creado con exito",
          });
          this.grupo = datagrupo;
          this.listarGrupos();
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
      this.displayCrearGrupo = false;
    } else {
      this.mensaje.mensajeError("Error al crear", "Es necesario completar todos los campos del formulario para crear.")
    }

  }

  editarGrupo(): void {
    this.newGrupo.nombreGrupo=this.fg?.get('nombreGrupo')?.value!;
    this.newGrupo.semestre=this.fg?.get('semestre')?.value!;
    this.newGrupo.idUsuarioModificacion=this.noDocumento;

    if (this.fg.valid) {
      this.GrupoService.actualizarGrupo(this.newGrupo).subscribe({
        next:(datagrupo)=>{
          this.messageService.add({
            severity:'success',
            summary:'CONFIRMACION',
            detail:'Registro actualizado con exito'
          });
          this.listGrupos!=datagrupo;
          this.listarGrupos();
          this.cerrarEditarModal();
        },
        error:(dataerror)=>{
          this.messageService.add({
            severity:'success',
            summary:'CONFIRMACION',
            detail:'Registro ingresado ya existe'
          })
        }
      })
    } else {
      this.mensaje.mensajeError("Error al editar", "Es necesario completar todos los campos del formulario para editar.");  
    }
  }

  eliminarGrupo(grupo: Grupo) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará permanentemente el grupo. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#26670f",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("El id es: ", grupo.idGrupo);

        this.GrupoService.eliminarGrupo(grupo.idGrupo!).subscribe({
          next: (datagrupo) => {
            this.listarGrupos();
          }
        });
      }
    });
  }
  //----cerrar modales--//
  cerrarCrearModal(): void {
    this.displayCrearGrupo = false;
  }

  cerrarEditarModal(): void {
    this.displayEditarGrupo = false;

  }
}