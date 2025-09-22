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

  displayCargarArchivo: boolean = false;
  displayGrupoRelacion: boolean = false;

  // Variables para carga de archivo
  archivoSeleccionado?: File;
  previewGrupoRelacion: any[] = [];
  cargandoArchivo: boolean = false;

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
    console.log('EN LISTAR PROGRAMAS');

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
      },
      error: (err) => console.error(err),
    });
    console.log('Programas cargados:', this.listProgramas);
    console.log('Espacios cargados:', this.listEspacios);
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

    this.newGrupoRelacion.espacioPrograma = this.listEspaciosPrograma.find(
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
  //----abrir modales--//
  abrirCrearModal() {
    this.fg.reset();
    this.newGrupoRelacion = new GrupoRelacion();
    this.displayCrearGrupo = true;
  }

  CargarArchivo() {
    this.displayCargarArchivo = true;
    this.archivoSeleccionado = undefined;
    this.previewGrupoRelacion = [];
  }

  //----cerrar modales--//
  cerrarCrearModal(): void {
    this.displayCrearGrupo = false;
  }

  cerrarEditarModal(): void {
    this.displayEditarGrupo = false;
  }
  cerrarCargarArchivoModal(): void {
    this.displayCargarArchivo = false;
    this.archivoSeleccionado = undefined;
    this.previewGrupoRelacion = [];
  }

  onFileSelected(event: any): void {
    const file = event.files[0];
    if (file && file.type === 'text/plain') {
      this.archivoSeleccionado = file;
      this.procesarArchivoParaPreview();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'ERROR',
        detail: 'El archivo debe ser de tipo texto plano (.txt)',
      });
    }
  }
  // Metodo para procesar el archivo y generar la vista previa
  procesarArchivoParaPreview(): void {
    if (!this.archivoSeleccionado) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      this.previewGrupoRelacion = this.parsearContenidoArchivo(content);

      if (this.previewGrupoRelacion.length === 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'ADVERTENCIA',
          detail:
            'No se encontraron relaciones grupoRelacion válidas en el archivo',
        });
      }
    };
    reader.readAsText(this.archivoSeleccionado);
  }
  // Método para parsear el contenido del archivo
  parsearContenidoArchivo(content: string): any[] {
    const lineas = content.split('\n').filter((linea) => linea.trim() !== '');
    const grupoRelacion: any[] = [];

    lineas.forEach((linea, index) => {
      const partes = linea.split(',');
      if (partes.length === 4) {
        const nombreSede = partes[0].trim();
        const nombreFacultad = partes[1].trim();
        const nombrePrograma = partes[2].trim();
        const nombreEspacio = partes[3].trim();

        if (nombreFacultad && nombreSede && nombrePrograma && nombreEspacio) {
          grupoRelacion.push({
            nombreFacultad: nombreFacultad,
            nombreSede: nombreSede,
            nombrePrograma: nombrePrograma,
            nombreEspacio: nombreEspacio,
            linea: index + 1,
          });
        }
      }
    });

    return grupoRelacion;
  }
  procesarArchivo(): void {
    if (!this.archivoSeleccionado || this.previewGrupoRelacion.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'ADVERTENCIA',
        detail: 'No hay registros válidos para procesar.',
      });
      return;
    }

    this.cargandoArchivo = true;

    // Función para normalizar strings
    const normalize = (str?: string) => str?.trim().toLowerCase();

    // Convertir preview a formato de GrupoRelacion con objetos de la lista
    const grupoRelacionParaCrear = this.previewGrupoRelacion
      .map((item, index) => {
        const sede = this.listSedes.find(
          (s) => normalize(s.nombreSede) === normalize(item.nombreSede)
        );
        const facultad = this.listFacultades.find(
          (f) => normalize(f.nombreFacultad) === normalize(item.nombreFacultad)
        );
        const espacioPrograma = this.listEspaciosPrograma.find(
          (ep) =>
            normalize(ep.espacioAcademico?.nombre) ===
              normalize(item.nombreEspacio) &&
            normalize(ep.programa?.nombre) === normalize(item.nombrePrograma)
        );

 
 
        return {
          sede,
          facultad,
          espacioPrograma,
          idUsuarioCreacion: this.noDocumento,
        };
      })
      .filter((item) => item.sede && item.facultad && item.espacioPrograma);

 

    if (grupoRelacionParaCrear.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'ADVERTENCIA',
        detail:
          'Ningún registro del archivo coincide con los datos existentes.',
      });
      this.cargandoArchivo = false;
      return;
    }

    // Enviar al backend
    this.grupoRelacionService
      .crearGrupoRelacionsMasivo(grupoRelacionParaCrear)
      .subscribe({
        next: (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'ÉXITO',
            detail: `Se cargaron ${response.length} relaciones correctamente.`,
          });
          this.listarGruposRelacion();
          this.cerrarCargarArchivoModal();
          this.cargandoArchivo = false;
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'ERROR',
            detail:
              'Error al cargar las relaciones. Verifique el formato del archivo.',
          });
          console.error('Error al cargar relaciones:', error);
          this.cargandoArchivo = false;
        },
      });
  }
}
