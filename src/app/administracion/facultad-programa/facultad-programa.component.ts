import { Component, OnInit, ViewChild } from '@angular/core';
import { Facultad } from '../../model/facultad-model';
import { Programa } from '../../model/programa-model';
import { FacultadPrograma, IFacultadPrograma } from '../../model/facultad-programa-model';
import { MessageService } from 'primeng/api';
import { StorageService } from '../../services/storage.service';
import { FacultadProgramaService } from '../../services/facultad-programa.service';
import { UtilConstants } from '../../util/util-constants';
import { FacultadService } from '../../services/facultad.service';
import { ProgramaService } from '../../services/programa.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facultad-programa',
  templateUrl: './facultad-programa.component.html',
  styleUrl: './facultad-programa.component.scss',
  providers: [MessageService],
})
export class FacultadProgramaComponent implements OnInit {

  @ViewChild('tablaProgramas') tablaProgramas!: Table;

  listFacultades: Facultad[] = [];
  listProgramas: Programa[] = [];
  listaFacultadPrograma: IFacultadPrograma[] = [];
  newFacultadSolicitantes?: FacultadPrograma[];

  facultadSeleccionada?: Facultad;
  programaSeleccionados?: Programa[] = [];

  displayCrearFacultadPrograma: boolean = false;
  displayCargarArchivo: boolean = false;

  filteredOptions?: any[];
  selectedOption: any = null;

  noDocumento?: string;

  // Variables para carga de archivo
  archivoSeleccionado?: File;
  previewFacultadProgramas: any[] = [];
  cargandoArchivo: boolean = false;

  listaOpciones = [
    {
      icono: 'pi pi-trash',
      nombre: 'Eliminar',
    }
  ];

  fg = new FormGroup({
    facultad: new FormControl(0, [
      Validators.required
    ]),
    programa: new FormControl<Programa[]>([]),
  })

  constructor(
    private facultadService: FacultadService,
    private programaService: ProgramaService,
    private messageService: MessageService,
    private facultadProgramaService: FacultadProgramaService
  ) { }

  ngOnInit(): void {
    this.listarFacultades();
    this.listarProgramas();
    this.listarFacultadPrograma();
    this.noDocumento = window.sessionStorage.getItem(UtilConstants.NUM_IDENTIFICACION)!;
  }

  listarFacultades() {
    this.facultadService.listarFacultades().subscribe({
      next: (datafacultad) => {
        this.listFacultades = datafacultad;
      },
      error: (dataerror) => console.log(dataerror),
    });
  }

  listarProgramas() {

    if (!this.facultadSeleccionada) {
      this.listProgramas = [];
      this.programaSeleccionados = [];
      return;
    }

    this.programaService.listarProgramas().subscribe({
      next: (dataprograma) => {
        this.facultadProgramaService.listarFacultadProgramaPorIdFacultad(this.facultadSeleccionada!.idFacultad!).subscribe({
          next: (facultadProgramasExistentes) => {
            this.listProgramas = dataprograma.filter(
              (programa) => !facultadProgramasExistentes.some(
                (facultadPrograma) => facultadPrograma.programa?.codPrograma === programa.codPrograma
              )
            );
            this.marcarProgramasSeleccionados();
          },
          error: (error) => {
            console.log('Error al obtener programas de la facultad:', error);
            this.listProgramas = dataprograma;
            this.marcarProgramasSeleccionados();
          }
        });
      },
      error: (dataerror) => console.log(dataerror),
    });
  }


  listarFacultadPrograma(){
    this.listaFacultadPrograma =[]
    this.facultadProgramaService.listarFacultadPrograma().subscribe({
      next:(datafacultadprograma)=>{
          this.listaFacultadPrograma=datafacultadprograma;
      },
      error: (dataerror) =>console.error('Error al listar facultad-programas:', dataerror),
    });
  }

  abrirModal(opcion: any, facultadPrograma: IFacultadPrograma): void {
    switch (opcion.nombre) {
      case 'Eliminar':
        this.eliminar(facultadPrograma);
        break;
      default:
        break;
    }
    setTimeout(() => {
      this.selectedOption = null;
    }, 0);
  }

  facultSeleccionada(event:any){

    if(event){
      this.facultadSeleccionada = this.listFacultades.find((facul) => facul.idFacultad === event)!;
   
      this.listarProgramas();
    }else{
      this.facultadSeleccionada = undefined
    }
  }

  //MErodo que permite seleccionar todos los programas de la facultad, para no hacerlo uno a uno
  marcarProgramasSeleccionados() {
    if (this.facultadSeleccionada) {
      this.programaSeleccionados = this.listaFacultadPrograma
        .filter(facultadPrograma => 
          facultadPrograma.facultad?.idFacultad === this.facultadSeleccionada?.idFacultad
        )
        .map(facultadPrograma => facultadPrograma.programa!)
        .filter(programa => programa); 
    } else {
      this.programaSeleccionados = [];
    }
  }


  crearFacultadSolicitante() {

    if (this.programaSeleccionados && this.programaSeleccionados.length > 0) {

      if (!this.newFacultadSolicitantes) {
        this.newFacultadSolicitantes = [];
      }

      let nuevosRegistros: IFacultadPrograma[] = this.programaSeleccionados.map(i => ({
        programa: {idPrograma: i.idPrograma, codPrograma: i.codPrograma ,nombre: i.nombre  }, // Se debe enviar el código del programa
        facultad: { idFacultad: this.facultadSeleccionada!.idFacultad, nombreFacultad: this.facultadSeleccionada?.nombreFacultad  }, // Se debe enviar el código de la facultad
        idUsuarioCreacion: this.noDocumento
      }));     

      let newLista = [...this.listaFacultadPrograma,...nuevosRegistros];
      
      this.facultadProgramaService.crearFacultadPrograma(newLista).subscribe({
        next: (datalistarequipo) => {
          this.messageService.add({
            severity: 'success',
            summary: 'CONFIRMACIÓN',
            detail: 'registro creado con éxito',
          });
          this.cerrarCrearModal();
          this.listarFacultadPrograma();
        },

        error: (dataerror) => {
          console.error(dataerror);
          
        },
      })

    } else {
      this.eliminarFacultadPrograma(this.programaSeleccionados!, this.facultadSeleccionada!);
    }
    console.log('FACULTAD SELECCIONADA:', this.facultadSeleccionada);
  }

  eliminarFacultadPrograma(seleccionados: Programa[], facultSelect: Facultad) {
    this.listaFacultadPrograma.forEach((i) => {
      if (!seleccionados?.some(select => select.codPrograma === i.programa?.codPrograma
      ) && i.facultad?.idFacultad == facultSelect.idFacultad) {

        this.facultadProgramaService.eliminarFacultadPrograma(i.programa!.codPrograma!).subscribe({
          next: (datalistarequipo) => {
            this.listarFacultadPrograma();
            this.cerrarCrearModal();
          },
          error: (dataerror) => {
            console.error(dataerror);

          },
        })

      }
    })

  }

  eliminar(event:any){
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará permanentemente esta relación. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#26670f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar"
    }).then((result) => {
      if(result.isConfirmed){
        this.facultadProgramaService.eliminarFacultadProgramaporid(event.idFacultadPrograma).subscribe({
          next:()=>{
            Swal.fire({
              title: "¡Eliminación exitosa!",
              text: "El dato seleccionado ha sido eliminado correctamente.",
              icon: "success"
            });
            this.listarFacultadPrograma();
          }
        });
      }
    });
    
  }

  //---- Abrir modales ----//
  abrirCrearModal(): void {
    this.fg.reset();
    this.newFacultadSolicitantes = [];
    this.displayCrearFacultadPrograma = true;
  }

  CargarArchivo(){
    this.displayCargarArchivo = true;
    this.archivoSeleccionado = undefined;
    this.previewFacultadProgramas = [];
  }

  limpiarListaTabla(): void {
    this.listProgramas = [];
    this.programaSeleccionados = [];
  }

  cerrarCrearModal(): void {
    this.listProgramas = [];
    this.programaSeleccionados = [];
    this.facultadSeleccionada = undefined;
    this.displayCrearFacultadPrograma = false;
  }

  cerrarCargarArchivoModal(): void {
    this.displayCargarArchivo = false;
    this.archivoSeleccionado = undefined;
    this.previewFacultadProgramas = [];
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
      this.previewFacultadProgramas = this.parsearContenidoArchivo(content);
      
      if (this.previewFacultadProgramas.length === 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'ADVERTENCIA',
          detail: 'No se encontraron relaciones facultad-programa válidas en el archivo'
        });
      }
    };
    reader.readAsText(this.archivoSeleccionado);
  }

  parsearContenidoArchivo(content: string): any[] {
    const lineas = content.split('\n').filter(linea => linea.trim() !== '');
    const facultadProgramas: any[] = [];

    lineas.forEach((linea, index) => {
      const partes = linea.split(',');
      if (partes.length === 2) {
        const nombreFacultad = partes[0].trim();
        const nombrePrograma = partes[1].trim();
        
        if (nombreFacultad && nombrePrograma) {
          facultadProgramas.push({
            nombreFacultad: nombreFacultad,
            nombrePrograma: nombrePrograma,
            linea: index + 1
          });
        }
      }
    });

    return facultadProgramas;
  }

  procesarArchivo(): void {
    if (!this.archivoSeleccionado || this.previewFacultadProgramas.length === 0) {
      return;
    }

    this.cargandoArchivo = true;
    
    // Convertir previewFacultadProgramas a formato de FacultadPrograma
    const facultadProgramasParaCrear = this.previewFacultadProgramas.map(item => {
      const facultad = this.listFacultades.find(f => f.nombreFacultad === item.nombreFacultad);
      const programa = this.listProgramas.find(p => p.nombre === item.nombrePrograma);
      
      return {
        facultad: facultad,
        programa: programa,
        idUsuarioCreacion: this.noDocumento
      };
    }).filter(item => item.facultad && item.programa);

    this.facultadProgramaService.crearFacultadProgramasMasivo(facultadProgramasParaCrear).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'ÉXITO',
          detail: `Se cargaron ${response.length} relaciones facultad-programa correctamente`
        });
        this.listarFacultadPrograma();
        this.cerrarCargarArchivoModal();
        this.cargandoArchivo = false;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'ERROR',
          detail: 'Error al cargar las relaciones facultad-programa. Verifique el formato del archivo.'
        });
        this.cargandoArchivo = false;
        console.error('Error al cargar facultad-programas:', error);
      }
    });
  }

}
