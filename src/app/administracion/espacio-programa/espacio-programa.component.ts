import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { EspacioAcademico } from '../../model/espacio-academico';
import { Programa } from '../../model/programa-model';
import {
  EspacioPrograma,
  IEspacioPrograma,
} from '../../model/espacio-programa';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgramaService } from '../../services/programa.service';
import { EspacioAcademicoService } from '../../services/espacio-academico.service';
import { EspacioProgramaService } from '../../services/espacio-programa.service';
import { UtilConstants } from '../../util/util-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-espacio-programa',
  templateUrl: './espacio-programa.component.html',
  styleUrl: './espacio-programa.component.scss',
  providers: [MessageService],
})
export class EspacioProgramaComponent implements OnInit {
  @ViewChild('tablaEspacios') tablaEspacios!: Table;

  listEspacios: EspacioAcademico[] = [];
  listProgramas: Programa[] = [];
  listaEspaciosProgramas: IEspacioPrograma[] = [];
  newEspaciosSolicitantes?: EspacioPrograma[];

  programaSeleccionados?: Programa;
  espaciosSeleccionados?: EspacioAcademico[] = [];

  displayCrearEspacioPrograma: boolean = false;
  displayCargarArchivo: boolean = false;

  // Propiedades para carga de archivos
  archivoSeleccionado?: File;
  previewEspacioProgramas: any[] = [];
  cargandoArchivo: boolean = false;

  noDocumento?: string;

  fg = new FormGroup({
    programa: new FormControl(0, [Validators.required]),
    espacio: new FormControl<EspacioAcademico[]>([]),
  });

  constructor(
    private programaService: ProgramaService,
    private espacioService: EspacioAcademicoService,
    private messageService: MessageService,
    private espacioProgramaService: EspacioProgramaService
  ) {}

  ngOnInit(): void {
    this.listarProgramas();
    this.listarEspacios();
    this.listarEspaciosProgramas();
    this.noDocumento = window.sessionStorage.getItem(
      UtilConstants.NUM_IDENTIFICACION
    )!;
  }

  listarProgramas() {
    this.programaService.listarProgramas().subscribe({
      next: (dataprograma) => {
        this.listProgramas = dataprograma;
        console.log('Programas recibidos:', dataprograma);
      },
      error: (dataerror) => console.log(dataerror),
    });
  }

  listarEspacios() {
    this.espacioService.listarEspaciosAcademicos().subscribe({
      next: (dataespacio) => {
        console.log('Espacios recibidos:', dataespacio);
        this.listEspacios = dataespacio.filter(
          (espacio) =>
            !this.listaEspaciosProgramas.some(
              (espacioPrograma) =>
                espacioPrograma.espacioAcademico?.idEspacioAcademico ===
                espacio.idEspacioAcademico
            )
        );
        this.marcarEspaciosSeleccionados();
      },
      error: (dataerror) => console.log(dataerror),
    });
  }

  listarEspaciosProgramas() {
    this.listaEspaciosProgramas = [];
    this.espacioProgramaService.listarEspacioPrograma().subscribe({
      next: (dataespacioPrograma) => {
        this.listaEspaciosProgramas = dataespacioPrograma;
      },
      error: (dataerror) => console.error(dataerror),
    });
  }

  programaSelect(event: any) {
    if (event) {
      this.programaSeleccionados = this.listProgramas.find(
        (programa) => programa.idPrograma === event  )!;

      this.listarEspacios();
    } else {
      this.programaSeleccionados = undefined;
    }
  }

  marcarEspaciosSeleccionados() {
    this.espaciosSeleccionados = this.listEspacios.filter((espacio) =>
      this.listaEspaciosProgramas.some(
        (espacioPrograma) =>
          espacioPrograma.espacioAcademico?.idEspacioAcademico ===
          espacio.idEspacioAcademico
      )
    );
  }

  crearEspacioSolicitante() {
    if (this.espaciosSeleccionados && this.espaciosSeleccionados.length > 0) {
      if (!this.newEspaciosSolicitantes) {
        this.newEspaciosSolicitantes = [];
      }

      let nuevosRegistros: IEspacioPrograma[] = this.espaciosSeleccionados.map(
        (i) => ({
          espacioAcademico: {
            idEspacioAcademico: i.idEspacioAcademico,
            nombreEspacio: i.nombre,
          },
          programa: {
            idPrograma: this.programaSeleccionados!.idPrograma,
            nombrePrograma: this.programaSeleccionados?.nombre,
          }, // Se debe enviar el código de la facultad
          idUsuarioCreacion: this.noDocumento,
        })
      );

      let newLista = [...this.listaEspaciosProgramas, ...nuevosRegistros];
  

      this.espacioProgramaService.crearEspacioPrograma(newLista).subscribe({
        next: (datalistarequipo) => {
          this.messageService.add({
            severity: 'success',
            summary: 'CONFIRMACIÓN',
            detail: 'registro creado con éxito',
          });
          this.cerrarCrearModal();
          this.listarEspaciosProgramas();
          /* this.listarEspacios(); */
        },

        error: (dataerror) => {
          console.error(dataerror);
        },
      });
    } else {
      this.eliminarEspacioPrograma(
        this.espaciosSeleccionados!,
        this.programaSeleccionados!
      );
    }
  }

  eliminarEspacioPrograma(
    seleccionados: EspacioAcademico[],
    programaSelect: Programa
  ) {
    this.listaEspaciosProgramas.forEach((i) => {
      if (
        !seleccionados?.some(
          (select) =>
            select.idEspacioAcademico === i.espacioAcademico?.idEspacioAcademico
        ) &&
        i.programa?.idPrograma == programaSelect.idPrograma
      ) {
        this.espacioProgramaService
          .eliminarEspacioPrograma(i.espacioAcademico!.idEspacioAcademico!)
          .subscribe({
            next: (datalistarequipo) => {
              this.listarEspaciosProgramas();
              this.cerrarCrearModal();
            },
            error: (dataerror) => {
              console.error(dataerror);
            },
          });
      }
    });
  }

  eliminar(event: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará permanentemente esta relación. ¿Deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#26670f',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.espacioProgramaService
          .eliminarEspacioPrograma(event.idEspacioPrograma)
          .subscribe({
            next: () => {
              Swal.fire({
                title: '¡Eliminación exitosa!',
                text: 'El dato seleccionado ha sido eliminado correctamente.',
                icon: 'success',
              });
              this.listarEspaciosProgramas();
            },
          });
      }
    });
  }

  //---- Abrir modales ----//
  abrirCrearModal(): void {
    this.fg.reset();
    this.newEspaciosSolicitantes = [];
    this.displayCrearEspacioPrograma = true;
  }

  limpiarListaTabla(): void {
    this.listEspacios = [];
    this.espaciosSeleccionados = [];
  }

  cerrarCrearModal(): void {
    this.listEspacios = [];
    this.espaciosSeleccionados = [];
    this.programaSeleccionados = undefined;
    this.displayCrearEspacioPrograma = false;
  }

  // Métodos para carga de archivos
  CargarArchivo(): void {
    this.displayCargarArchivo = true;
    this.archivoSeleccionado = undefined;
    this.previewEspacioProgramas = [];
  }

  onFileSelect(event: any): void {
    this.archivoSeleccionado = event.files[0];
    if (this.archivoSeleccionado) {
      this.procesarArchivoPreview();
    }
  }

  procesarArchivoPreview(): void {
    if (!this.archivoSeleccionado) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const contenido = e.target?.result as string;
      this.previewEspacioProgramas = this.parsearContenidoArchivo(contenido);
    };
    reader.readAsText(this.archivoSeleccionado);
  }

  parsearContenidoArchivo(contenido: string): any[] {
    const lineas = contenido.split('\n').filter(linea => linea.trim() !== '');
    const relaciones: any[] = [];

    lineas.forEach((linea, index) => {
      const partes = linea.split(',').map(parte => parte.trim());
      if (partes.length === 2) {
        relaciones.push({
          nombrePrograma: partes[0],
          nombreEspacio: partes[1],
          linea: index + 1
        });
      }
    });

    return relaciones;
  }

  procesarArchivo(): void {
    if (!this.archivoSeleccionado || this.previewEspacioProgramas.length === 0) {
      return;
    }

    this.cargandoArchivo = true;

    // Simular procesamiento de archivo
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'CONFIRMACIÓN',
        detail: `Se procesaron ${this.previewEspacioProgramas.length} relaciones desde el archivo`,
      });
      
      this.cargandoArchivo = false;
      this.cerrarCargarArchivoModal();
      this.listarEspaciosProgramas();
    }, 2000);
  }

  cerrarCargarArchivoModal(): void {
    this.displayCargarArchivo = false;
    this.archivoSeleccionado = undefined;
    this.previewEspacioProgramas = [];
    this.cargandoArchivo = false;
  }
}
