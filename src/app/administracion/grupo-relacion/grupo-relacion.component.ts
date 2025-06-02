import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GrupoRelacion, IGrupoRelacion } from '../../model/grupo-relacion';
import { Grupo } from '../../model/grupo-model';
import { Facultad } from '../../model/facultad-model';
import { Sede } from '../../model/sede-model';
import { EspacioAcademico } from '../../model/espacio-academico';
import { Utilities } from '../../util/utilities';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SedeService } from '../../services/sede.service';
import { GrupoService } from '../../services/grupo.service';
import { UtilConstants } from '../../util/util-constants';
import { EspacioAcademicoService } from '../../services/espacio-academico.service';
import { FacultadService } from '../../services/facultad.service';
import { GrupoRelacionService } from '../../services/grupo-relacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grupo-relacion',
  templateUrl: './grupo-relacion.component.html',
  styleUrl: './grupo-relacion.component.scss',
  providers: [MessageService],
})
export class GrupoRelacionComponent implements OnInit {

  listGruposRelacion: IGrupoRelacion[] = [];
  listGrupos: Grupo[] = [];
  listSedes: Sede[] = [];
  listEspacios: EspacioAcademico[] = [];
  listFacultades: Facultad[] = [];
  grupoRelacion?: IGrupoRelacion;

  newGrupoRelacion: GrupoRelacion = new GrupoRelacion();

  grupoSeleccionado?: Grupo;
  sedeSeleccionada?: Sede;
  espacioSeleccionado?: EspacioAcademico;
  facultadSeleccionada?: Facultad;


  displayCrearGrupo: boolean = false;
  displayEditarGrupo: boolean = false;

  filteredOptions?: any[];
  selectedOption: any = null;

  noDocumento?: string

  mensaje = Utilities;


  fg = new FormGroup({

    grupo: new FormControl('', [Validators.required]),
    sede: new FormControl('', [Validators.required]),
    facultad: new FormControl('', [Validators.required]),
    espacio: new FormControl('', [Validators.required]),
  })

  constructor(
    private grupoRelacionService: GrupoRelacionService,
    private grupoService: GrupoService,
    private sedeService: SedeService,
    private espacioService: EspacioAcademicoService,
    private facultadService: FacultadService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.listarGruposRelacion();
    this.listarGrupos();
    this.listarSedes();
    this.listarEspaciosAcademicos();
    this.listarFacultades();
    this.noDocumento = window.sessionStorage.getItem(UtilConstants.NUM_IDENTIFICACION)!;
  }

  GrupoSelecconado(event: any) {
    console.log("El grupo seleccionado es: ", event);

    if (event) {
      this.grupoSeleccionado = this.listGrupos.find((grupo) => grupo.idGrupo === event)!;

    } else {
      this.grupoSeleccionado = undefined;
    }
  }

  SedeSelecconado(event: any) {
    console.log("El grupo seleccionado es: ", event);

    if (event) {
      this.sedeSeleccionada = this.listSedes.find((sede) => sede.idSede === event)!;

    } else {
      this.sedeSeleccionada = undefined;
    }
  }
  EspacioSelecconado(event: any) {
    console.log("El grupo seleccionado es: ", event);

    if (event) {
      this.espacioSeleccionado = this.listEspacios.find((espacio) => espacio.idEspacioAcademico === event)!;

    } else {
      this.espacioSeleccionado = undefined;
    }
  }
  FacultadSelecconado(event: any) {
    console.log("El grupo seleccionado es: ", event);

    if (event) {
      this.facultadSeleccionada = this.listFacultades.find((facultad) => facultad.idFacultad === event)!;

    } else {
      this.facultadSeleccionada = undefined;
    }
  }
  //----- Metodos que permiten listar 

  listarGrupos() {
    this.grupoService.listarGrupos().subscribe({
      next: (datagrupo) => {
        this.listGrupos = datagrupo;
      },
      error: (dataerror) => console.log(dataerror),
    });
  }

  listarSedes() {
    this.sedeService.listarSedes().subscribe({
      next: (datasede) => {
        this.listSedes = datasede;
      },
      error: (dataerror) => console.log(dataerror),
    });
  }
  listarEspaciosAcademicos() {
    this.espacioService.listarEspaciosAcademicos().subscribe({
      next: (dataespacio) => {
        this.listEspacios = dataespacio;
      },
      error: (dataerror) => console.log(dataerror),
    });
  }
  listarFacultades() {
    this.facultadService.listarFacultades().subscribe({
      next: (datafacultad) => {
        this.listFacultades = datafacultad;
      },
      error: (dataerror) => console.log(dataerror),
    });
  }
  listarGruposRelacion(): void {
    this.listGruposRelacion = [];
    this.grupoRelacionService.listarGrupoRelacion().subscribe({
      next: (datagruporelacion) => {
        this.listGruposRelacion = datagruporelacion;
      },
      error: (dataerror) => console.error('Eror al listar los grupos relacion', dataerror),
    });


  }
  abrirCrearModal() {
    this.fg.reset();
    this.newGrupoRelacion = new GrupoRelacion();
    this.displayCrearGrupo = true;
  }

      // -- Metodo de crear -- //
      creargrupoRelacion() {   
        
        const grupoId = this.fg?.get('grupo')?.value!;
        const sedeId = this.fg?.get('sede')?.value!;
        const espacioId = this.fg?.get('espacio')?.value!;
        const facultadId = this.fg?.get('facultad')?.value!;
       
        this.newGrupoRelacion.grupo = this.listGrupos.find(g => g.idGrupo === Number(grupoId))!;
        this.newGrupoRelacion.sede=this.listSedes.find(s => s.idSede === Number(sedeId))!;
        this.newGrupoRelacion.espacioAcademico=this.listEspacios.find(e => e.idEspacioAcademico === Number(espacioId))!;
        this.newGrupoRelacion.facultad=this.listFacultades.find(f => f.idFacultad === Number(facultadId))!;
        this.newGrupoRelacion.idUsuarioCreacion = this.noDocumento;
        if (this.fg.valid) {
          this.grupoRelacionService.crearGrupoRelacion(this.newGrupoRelacion).subscribe({
            next: (datagruporelacion) => {
              this.messageService.add({
                severity: 'success',
                summary: 'CONFIRMACION',
                detail: 'Registro creado con exito',
              });
              this.grupoRelacion = datagruporelacion;
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
     eliminarGrupoRelacion(grupoRelacion :GrupoRelacion){
        Swal.fire({
          title: "¿Estás seguro?",
          text: "Esta acción eliminará permanentemente el grupo relacion. ¿Deseas continuar?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#26670f",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Si, eliminar"
        }).then((result) => {
          if (result.isConfirmed) {
            console.log("El id es: ", grupoRelacion.idGrupoRelacion);
            
            this.grupoService.eliminarGrupo(grupoRelacion.idGrupoRelacion!).subscribe({
              next:(datagrupo)=>{
                this.listarGruposRelacion();
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
