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

  noDocumento?: string;

  // Variables para carga de archivo
  archivoSeleccionado?: File;
  previewEspacioProgramas: any[] = [];
  cargandoArchivo: boolean = false;

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

  //---- Métodos para cargue masivo ----//
  CargarArchivo(): void {
    this.displayCargarArchivo = true;
    this.archivoSeleccionado = undefined;
    this.previewEspacioProgramas = [];
  }

  cerrarCargarArchivoModal(): void {
    this.displayCargarArchivo = false;
    this.archivoSeleccionado = undefined;
    this.previewEspacioProgramas = [];
  }

  onFileSelect(event: any): void {
    const file = event.files[0];
    if (file && file.type === 'text/plain') {
      this.archivoSeleccionado = file;
      this.procesarArchivoParaPreview();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'ERROR',
        detail: 'Por favor seleccione un archivo de texto (.txt) válido'
      });
    }
  }

  procesarArchivoParaPreview(): void {
    if (!this.archivoSeleccionado) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      this.previewEspacioProgramas = this.parsearContenidoArchivo(content);
      
      if (this.previewEspacioProgramas.length === 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'ADVERTENCIA',
          detail: 'No se encontraron relaciones espacio-programa válidas en el archivo'
        });
      }
    };
    reader.readAsText(this.archivoSeleccionado);
  }

  parsearContenidoArchivo(content: string): any[] {
    const lineas = content.split('\n').filter(linea => linea.trim() !== '');
    const espacioProgramas: any[] = [];

    lineas.forEach((linea, index) => {
      const partes = linea.split(',');
      if (partes.length === 2) {
        const nombrePrograma = partes[0].trim();
        const nombreEspacio = partes[1].trim();
        
        if (nombrePrograma && nombreEspacio) {
          espacioProgramas.push({
            nombrePrograma: nombrePrograma,
            nombreEspacio: nombreEspacio,
            linea: index + 1
          });
        }
      }
    });

    return espacioProgramas;
  }

  procesarArchivo(): void {
    if (!this.archivoSeleccionado || this.previewEspacioProgramas.length === 0) {
      return;
    }
    this.cargandoArchivo = true;
    this.programaService.listarProgramas().subscribe({
      next: (todosLosProgramas) => {
        this.espacioService.listarEspaciosAcademicos().subscribe({
          next: (todosLosEspacios) => {
            
            const espacioProgramasParaCrear = this.previewEspacioProgramas.map(item => {
              let programa = todosLosProgramas.find(p => p.nombre === item.nombrePrograma);
              let espacio = todosLosEspacios.find(e => e.nombre === item.nombreEspacio);
              
              if (!programa) {
                programa = todosLosProgramas.find(p => 
                  p.nombre?.toLowerCase().trim() === item.nombrePrograma.toLowerCase().trim()
                );
              }
              
              if (!espacio) {
                espacio = todosLosEspacios.find(e => 
                  e.nombre?.toLowerCase().trim() === item.nombreEspacio.toLowerCase().trim()
                );
              }
              
              if (!programa) {
                programa = todosLosProgramas.find(p => 
                  p.nombre?.toLowerCase().includes(item.nombrePrograma.toLowerCase()) ||
                  item.nombrePrograma.toLowerCase().includes(p.nombre?.toLowerCase() || '')
                );
              }
              
              if (!espacio) {
                espacio = todosLosEspacios.find(e => 
                  e.nombre?.toLowerCase().includes(item.nombreEspacio.toLowerCase()) ||
                  item.nombreEspacio.toLowerCase().includes(e.nombre?.toLowerCase() || '')
                );
              }
              
              return {
                programa: programa,
                espacioAcademico: espacio,
                idUsuarioCreacion: this.noDocumento
              };
            }).filter(item => item.programa && item.espacioAcademico);
            

            if (espacioProgramasParaCrear.length === 0) {
              this.messageService.add({
                severity: 'warn',
                summary: 'ADVERTENCIA',
                detail: 'No se encontraron coincidencias entre los datos del archivo y los registros existentes. Verifique los nombres de programas y espacios.'
              });
              this.cargandoArchivo = false;
              return;
            }

            this.espacioProgramaService.crearEspacioProgramasMasivo(espacioProgramasParaCrear).subscribe({
              next: (response: any) => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'ÉXITO',
                  detail: `Se cargaron ${response.length} relaciones espacio-programa correctamente`
                });
                this.listarEspaciosProgramas();
                this.cerrarCargarArchivoModal();
                this.cargandoArchivo = false;
              },
              error: (error: any) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'ERROR',
                  detail: 'Error al cargar las relaciones espacio-programa. Verifique el formato del archivo.'
                });
                this.cargandoArchivo = false;
                console.error('Error al cargar espacio-programas:', error);
              }
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'ERROR',
              detail: 'Error al obtener la lista de espacios académicos'
            });
            this.cargandoArchivo = false;
          }
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'ERROR',
          detail: 'Error al obtener la lista de programas'
        });
        this.cargandoArchivo = false;
      }
    });
  }
}
