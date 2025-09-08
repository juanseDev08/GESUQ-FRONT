import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgramaService } from '../../services/programa.service';
import { MessageService } from 'primeng/api';
import { IPrograma, Programa } from '../../model/programa-model';
import { Utilities } from '../../util/utilities';
import { UtilConstants } from '../../util/util-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-programa',
  templateUrl: './programa.component.html',
  styleUrl: './programa.component.scss',
  providers: [MessageService],
})
export class ProgramaComponent implements OnInit {

  listPrograma: IPrograma[]=[];
  programa ?: IPrograma;
  newPrograma: Programa = new Programa();

  displayCrearPrograma: boolean = false;
  displayEditarPrograma: boolean = false;
  displayCargarArchivo: boolean = false;

  filteredOptions?: any[];
  selectedOption: any = null;

  noDocumento?: string;

  // Variables para carga de archivo
  archivoSeleccionado?: File;
  previewProgramas: any[] = [];
  cargandoArchivo: boolean = false;
  
  mensaje = Utilities;

  
  listaOpciones = [
    {
      icono: 'pi pi-pen-to-square',
      nombre: 'Editar',
      tooltip: 'Abrir modal para editar el programa',
  
    },
    {
      icono: 'pi pi-trash',
      nombre: 'Eliminar',
    }
  ];

  constructor(
    private programaService : ProgramaService,
    private messageService: MessageService, 
  ){}

  ngOnInit(): void {
    this.listarProgramas();
    this.noDocumento = window.sessionStorage.getItem(UtilConstants.NUM_IDENTIFICACION)!;
  }

  fg = new FormGroup({
    codPrograma: new FormControl('',[
      Validators.required,
    ]),
    nombre: new FormControl('', [
      Validators.required,
    ]),
  })

  abrirModal(opcion: any, programa: IPrograma): void {
      switch (opcion.nombre) {
        case 'Editar':
          this.abrirEditarModal(programa);
          break;
        case 'Eliminar':
          this.eliminar(programa);
          break;
  
        default:
          break;
      }
      setTimeout(() => {
        this.selectedOption = null;
      }, 0);
    } 
  
  
  //----- Metodos que permiten listar 
  listarProgramas():void{
    this.listPrograma =[];
    this.programaService.listarProgramas().subscribe({
      next:(dataprograma) =>{
        this.listPrograma = dataprograma;
      },
      error:(dataerror)=> console.log(dataerror),
    })
  }

  abrirCrearModal(){
    this.fg.reset();
    this.newPrograma= new Programa();
    this.displayCrearPrograma = true;
  }

  CargarArchivo(){
    this.displayCargarArchivo = true;
    this.archivoSeleccionado = undefined;
    this.previewProgramas = [];
  }
  
  abrirEditarModal(programa : Programa){
    this.fg.reset();
    this.newPrograma ={...programa };
    this.fg?.get('codPrograma')?.setValue(programa.codPrograma!);
    this.fg?.get('nombre')?.setValue(programa.nombre!);
    this.displayEditarPrograma=true;
  }

  // -- Metodo de crear -- //
  crearPrograma(){
    this.newPrograma.codPrograma =  this.fg?.get('codPrograma')?.value!;
    this.newPrograma.nombre =  this.fg?.get('nombre')?.value!;
    this.newPrograma.idUsuarioCreacion = this.noDocumento;
    if(this.fg.valid){
      this.programaService.crearPrograma(this.newPrograma).subscribe({
        next:(dataprograma) =>{
          this.messageService.add({
            severity: 'success',
            summary: 'CONFIRMACIÓN',
            detail: 'Registro creado con éxito',
          });
          this.programa = dataprograma;
          this.listarProgramas();
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
      this.displayCrearPrograma=false;
    }else{
      this.mensaje.mensajeError("Error al crear","Es necesario completar todos los campos del formulario para crear.");
    }
  }

  editarPrograma(): void {
    this.newPrograma.codPrograma = this.fg?.get('codPrograma')?.value!;
    this.newPrograma.nombre =  this.fg?.get('nombre')?.value!;
    this.newPrograma.idUsuarioModificacion = this.noDocumento;
    if(this.fg.valid){
      this.programaService.actualizarPrograma(this.newPrograma).subscribe({
        next:(dataPrograma)=>{
          this.messageService.add({
            severity: 'success',
            summary: 'CONFIRMACIÓN',
            detail: 'Registro actualizado con éxito',
          });
          this.listPrograma != dataPrograma;
          this.listarProgramas();
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

  eliminar(programa :IPrograma){
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará permanentemente el programa. ¿Deseas continuar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#26670f",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, eliminar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.programaService.eliminarPrograma(programa.idPrograma!).subscribe({
            next:(dataprograma)=>{
              this.listarProgramas();
            }
          });
        }
      });
    }

 //----cerrar modales--//
  cerrarCrearModal(): void {
    this.displayCrearPrograma = false;
  }

  cerrarEditarModal(): void {
    this.displayEditarPrograma = false;
  }

  cerrarCargarArchivoModal(): void {
    this.displayCargarArchivo = false;
    this.archivoSeleccionado = undefined;
    this.previewProgramas = [];
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
      this.previewProgramas = this.parsearContenidoArchivo(content);
      
      if (this.previewProgramas.length === 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'ADVERTENCIA',
          detail: 'No se encontraron programas válidos en el archivo'
        });
      }
    };
    reader.readAsText(this.archivoSeleccionado);
  }

  parsearContenidoArchivo(content: string): any[] {
    const lineas = content.split('\n').filter(linea => linea.trim() !== '');
    const programas: any[] = [];

    lineas.forEach((linea, index) => {
      const partes = linea.split(',');
      if (partes.length === 2) {
        const codPrograma = partes[0].trim();
        const nombre = partes[1].trim();
        
        if (codPrograma && nombre) {
          programas.push({
            codPrograma: codPrograma,
            nombre: nombre,
            linea: index + 1
          });
        }
      }
    });

    return programas;
  }

  procesarArchivo(): void {
    if (!this.archivoSeleccionado || this.previewProgramas.length === 0) {
      return;
    }

    this.cargandoArchivo = true;
    
    // Convertir previewProgramas a formato de Programa
    const programasParaCrear = this.previewProgramas.map(programa => ({
      codPrograma: programa.codPrograma,
      nombre: programa.nombre,
      idUsuarioCreacion: this.noDocumento
    }));

    this.programaService.crearProgramasMasivo(programasParaCrear).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'ÉXITO',
          detail: `Se cargaron ${response.length} programas correctamente`
        });
        this.listarProgramas();
        this.cerrarCargarArchivoModal();
        this.cargandoArchivo = false;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'ERROR',
          detail: 'Error al cargar los programas. Verifique el formato del archivo.'
        });
        this.cargandoArchivo = false;
        console.error('Error al cargar programas:', error);
      }
    });
  }

}
