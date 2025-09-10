import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FacultadService } from '../../services/facultad.service';
import { Facultad, IFacultad } from '../../model/facultad-model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { StorageService } from '../../services/storage.service';
import { UtilConstants } from '../../util/util-constants';
import { Utilities } from '../../util/utilities';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facultad',
  templateUrl: './facultad.component.html',
  styleUrl: './facultad.component.scss',
  providers: [MessageService],
})
export class FacultadComponent implements OnInit {

  listFacultad: IFacultad[]=[];
  facultad?: IFacultad;
  newFacultad: Facultad = new Facultad();

  displayCrearFacultad: boolean = false;
  displayEditarFacultad: boolean = false;
  displayCargarArchivo: boolean = false;

  filteredOptions?: any[];
  selectedOption: any = null;

  noDocumento?: string;

  // Variables para carga de archivo
  archivoSeleccionado?: File;
  previewFacultades: any[] = [];
  cargandoArchivo: boolean = false;

  mensaje = Utilities;

  listaOpciones = [
    {
      icono: 'pi pi-pencil',
      nombre: 'Editar',
      tooltip: 'Abrir modal para editar la facultad',
    },
    {
      icono: 'pi pi-trash',
      nombre: 'Eliminar',
    }
  ];

  fg= new FormGroup({
    nombre: new FormControl('', [
      Validators.required
    ]),
  });

  constructor(
    private facultadService: FacultadService,
    private messageService: MessageService,
  ){}

  ngOnInit(): void {
    this.listarFacultades();
    this.noDocumento = window.sessionStorage.getItem(UtilConstants.NUM_IDENTIFICACION)!;
  }


  //----- Metodos que permiten listar 

  listarFacultades():void{
    this.listFacultad = [];
    this.facultadService.listarFacultades().subscribe({
      next:(datafacultad) =>{
        this.listFacultad = datafacultad;
      },
      error:(dataerror)=> console.error('Error al listar facultades:', dataerror),
    });
  }

  abrirModal(opcion: any, facultad: IFacultad): void {
    switch (opcion.nombre) {
      case 'Editar':
        this.abrirEditarModal(facultad);
        break;
      case 'Eliminar':
        this.eliminar(facultad);
        break;

      default:
        break;
    }
    setTimeout(() => {
      this.selectedOption = null;
    }, 0);
  }



abrirCrearModal(){
  this.fg.reset();
  this.newFacultad= new Facultad();
  this.displayCrearFacultad = true;
}

CargarArchivo(){
  this.displayCargarArchivo = true;
  this.archivoSeleccionado = undefined;
  this.previewFacultades = [];
}

abrirEditarModal(facultad : Facultad){
  this.fg.reset();
  this.newFacultad ={...facultad };
  this.fg?.get('nombre')?.setValue(facultad.nombreFacultad!);
  this.displayEditarFacultad=true;
}

// -- Metodo de crear -- //
crearFacultad(){
  this.newFacultad.nombreFacultad = this.fg?.get('nombre')?.value!;
  this.newFacultad.idUsuarioCreacion= this.noDocumento;
  if(this.fg.valid){
    this.facultadService.crearFacultad(this.newFacultad).subscribe({
      next:(datafacultad)=>{
        this.messageService.add({
          severity: 'success',
          summary: 'CONFIRMACIÓN',
          detail: 'Registro creado con éxito',
        });
        this.facultad = datafacultad;
        this.listarFacultades();
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
    this.displayCrearFacultad=false;
  }else{
    this.mensaje.mensajeError("Error al crear","Es necesario completar todos los campos del formulario para crear.");
  }

}

editarFacultad(): void{
  this.newFacultad.nombreFacultad = this.fg?.get('nombre')?.value!;
  this.newFacultad.idUsuarioModificacion = this.noDocumento;
  if(this.fg.valid){
    this.facultadService.actualizarFacultad(this.newFacultad).subscribe({
      next:(datafacultad)=>{
        this.messageService.add({
          severity: 'success',
          summary: 'CONFIRMACIÓN',
          detail: 'Registro actualizado con éxito',
        }); 
        this.listFacultad != datafacultad;
        this.listarFacultades();
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
    this.displayCrearFacultad = false;
  }

  cerrarEditarModal(): void {
    this.displayEditarFacultad = false;
  }

  cerrarCargarArchivoModal(): void {
    this.displayCargarArchivo = false;
    this.archivoSeleccionado = undefined;
    this.previewFacultades = [];
  }

  eliminar(facultad: IFacultad){
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará permanentemente la facultad. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#26670f",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("El id es: ", facultad.idFacultad);
        
        this.facultadService.eliminarFacultad(facultad.idFacultad!).subscribe({
          next:(datafacultad)=>{
            this.listarFacultades();
          }
        });
      }
    });
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
      this.previewFacultades = this.parsearContenidoArchivo(content);
      
      if (this.previewFacultades.length === 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'ADVERTENCIA',
          detail: 'No se encontraron facultades válidas en el archivo'
        });
      }
    };
    reader.readAsText(this.archivoSeleccionado);
  }

  parsearContenidoArchivo(content: string): any[] {
    const lineas = content.split('\n').filter(linea => linea.trim() !== '');
    const facultades: any[] = [];

    lineas.forEach((linea, index) => {
      const nombre = linea.trim();
      
      if (nombre) {
        facultades.push({
          nombre: nombre,
          linea: index + 1
        });
      }
    });

    return facultades;
  }

  procesarArchivo(): void {
    if (!this.archivoSeleccionado || this.previewFacultades.length === 0) {
      return;
    }

    this.cargandoArchivo = true;
    
    // Convertir previewFacultades a formato de Facultad
    const facultadesParaCrear = this.previewFacultades.map(facultad => ({
      nombreFacultad: facultad.nombre,
      idUsuarioCreacion: this.noDocumento
    }));

    this.facultadService.crearFacultadesMasivo(facultadesParaCrear).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'ÉXITO',
          detail: `Se cargaron ${response.length} facultades correctamente`
        });
        this.listarFacultades();
        this.cerrarCargarArchivoModal();
        this.cargandoArchivo = false;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'ERROR',
          detail: 'Error al cargar las facultades. Verifique el formato del archivo.'
        });
        this.cargandoArchivo = false;
        console.error('Error al cargar facultades:', error);
      }
    });
  }

}
