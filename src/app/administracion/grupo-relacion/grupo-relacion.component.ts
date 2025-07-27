import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GrupoRelacion, IGrupoRelacion } from '../../model/grupo-relacion';
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
import { EspacioPrograma } from '../../model/espacio-programa';
import { Programa } from '../../model/programa-model';
import { EspacioProgramaService } from '../../services/espacio-programa.service';

@Component({
  selector: 'app-grupo-relacion',
  templateUrl: './grupo-relacion.component.html',
  styleUrl: './grupo-relacion.component.scss',
  providers: [MessageService],
})
export class GrupoRelacionComponent implements OnInit {
  listGruposRelacion: IGrupoRelacion[] = [];
  listSedes: Sede[] = [];
  listEspacios: EspacioAcademico[] = [];
  listProgramas: Programa[] = [];
  listFacultades: Facultad[] = [];
  listEspaciosPrograma: EspacioPrograma[] = [];
  espaciosFiltrados: EspacioAcademico[] = [];
  grupoRelacion?: IGrupoRelacion;

  newGrupoRelacion: GrupoRelacion = new GrupoRelacion();

  sedeSeleccionada?: Sede;
  facultadSeleccionada?: Facultad;
/*   espacioAcademicoSeleccionado?: EspacioAcademico;
  programaSeleccionado?: Programa; */

  displayCrearGrupo: boolean = false;
  displayEditarGrupo: boolean = false;

  /* filteredOptions?: any[]; */
  /*  selectedOption: any = null; */

  noDocumento?: string;

  mensaje = Utilities;

  fg = new FormGroup({
    sede: new FormControl('', [Validators.required]),
    facultad: new FormControl('', [Validators.required]),
    programa: new FormControl('', [Validators.required]),
    espacio: new FormControl('', [Validators.required]),
  });

  constructor(
    private grupoRelacionService: GrupoRelacionService,  
    private sedeService: SedeService,
    private espacioProgramaService: EspacioProgramaService,
    private facultadService: FacultadService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.listarGruposRelacion();
    this.listarSedes();
    this.listarFacultades();
    this.listarEspaciosPrograma();

    this.noDocumento = window.sessionStorage.getItem(
      UtilConstants.NUM_IDENTIFICACION
    )!;
  }

  SedeSelecconado(event: any) {
    console.log('El grupo seleccionado es: ', event);

    if (event) {
      this.sedeSeleccionada = this.listSedes.find(
        (sede) => sede.idSede === event
      )!;
    } else {
      this.sedeSeleccionada = undefined;
    }
  }

  FacultadSelecconado(event: any) {
    console.log('El grupo seleccionado es: ', event);

    if (event) {
      this.facultadSeleccionada = this.listFacultades.find(
        (facultad) => facultad.idFacultad === event
      )!;
    } else {
      this.facultadSeleccionada = undefined;
    }
  }
  //----- Metodos que permiten listar

  listarSedes() {
    this.sedeService.listarSedes().subscribe({
      next: (datasede) => {
        this.listSedes = datasede;
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
      error: (dataerror) =>
        console.error('Eror al listar los grupos relacion', dataerror),
    });
  }

  listarEspaciosPrograma() {
    this.listEspaciosPrograma = [];
    this.espacioProgramaService.listarEspacioPrograma().subscribe({
      next: (data) => {
        this.listEspaciosPrograma = data;

        // Extraer programas únicos
        this.listProgramas = Array.from(
          new Map(
            data.map((item) => [item.programa?.idPrograma, item.programa])
          ).values()
        ).filter((p): p is Programa => p !== undefined);

        // Extraer espacios académicos únicos
        this.listEspacios = Array.from(
          new Map(
            data.map((item) => [
              item.espacioAcademico?.idEspacioAcademico,
              item.espacioAcademico,
            ])
          ).values()
        ).filter((e): e is EspacioAcademico => e !== undefined);

       
        console.log('Programas cargados:', this.listProgramas);
        console.log('Espacios cargados:', this.listEspacios);
      },
      error: (err) => console.error(err),
    });
  }

  filtrarEspaciosPorPrograma(idPrograma: number) {
    this.espaciosFiltrados = this.listEspaciosPrograma
      .filter((ep) => ep.programa?.idPrograma === idPrograma)
      .map((ep) => ep.espacioAcademico!)
      .filter(
        (espacio, index, self) =>
          index ===
          self.findIndex(
            (e) => e.idEspacioAcademico === espacio.idEspacioAcademico
          )
      );
    console.log('Espacios filtrados:', this.espaciosFiltrados);
  }
  abrirCrearModal() {
    this.fg.reset();
    this.newGrupoRelacion = new GrupoRelacion();
    this.displayCrearGrupo = true;
  }

  // -- Metodo de crear -- //
  creargrupoRelacion() {
    const sedeId = this.fg?.get('sede')?.value!;
    const facultadId = this.fg?.get('facultad')?.value!;
    const idPrograma = this.fg?.get('programa')?.value!;
    const idEspacio = this.fg?.get('espacio')?.value!;
    

    this.newGrupoRelacion.sede = this.listSedes.find(
      (s) => s.idSede === Number(sedeId)
    )!;
    this.newGrupoRelacion.facultad = this.listFacultades.find(
      (f) => f.idFacultad === Number(facultadId)
    )!;

    this.newGrupoRelacion.espacioPrograma=this.listEspaciosPrograma.find(
      (ep) =>
        ep.programa?.idPrograma === Number(idPrograma) &&
        ep.espacioAcademico?.idEspacioAcademico === Number(idEspacio)
    );


      this.newGrupoRelacion.idUsuarioCreacion = this.noDocumento;  
   

    if (this.fg.valid) {
      console.log('Objeto que se envía al backend:', this.newGrupoRelacion);
      this.grupoRelacionService
        .crearGrupoRelacion(this.newGrupoRelacion)
        .subscribe({
          next: (datagruporelacion) => {
            this.messageService.add({
              severity: 'success',
              summary: 'CONFIRMACION',
              detail: 'Registro creado con exito',
            });
            this.grupoRelacion = datagruporelacion;
            this.listarGruposRelacion();
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
      this.displayCrearGrupo = false;
    } else {
      this.mensaje.mensajeError(
        'Error al crear',
        'Es necesario completar todos los campos del formulario para crear.'
      );
    }
  }
  eliminarGrupoRelacion(grupoRelacion: GrupoRelacion) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará permanentemente el grupo relacion. ¿Deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#26670f',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('El id es: ', grupoRelacion.idGrupoRelacion);

        this.grupoRelacionService
          .eliminarGrupoRelacion(grupoRelacion.idGrupoRelacion!)
          .subscribe({
            next: (datagrupo) => {
              this.listarGruposRelacion();
            },
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
