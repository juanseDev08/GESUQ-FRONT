import { Component, OnInit, ViewChild } from '@angular/core';
import { EspacioAcademicoService } from '../../services/espacio-academico.service';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { EspacioAcademico, IEspacioAcademico } from '../../model/espacio-academico';
import { Utilities } from '../../util/utilities';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilConstants } from '../../util/util-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-espacio-academico',
  templateUrl: './espacio-academico.component.html',
  styleUrl: './espacio-academico.component.scss',
  providers: [MessageService],
})
export class EspacioAcademicoComponent implements OnInit {
  @ViewChild('uploader') uploader?: FileUpload;
  listEspacioAcademico: IEspacioAcademico[] = [];
  espacioAcademico?: IEspacioAcademico;
  newEspacioAcademico: EspacioAcademico = new EspacioAcademico();

  displayCrearEspacioAcademico: boolean = false;
  displayEditarEspacioAcademico: boolean = false;
  displayCargarArchivo: boolean = false;

  filteredOptions?: any[];
  selectedOption: any = null;

  noDocumento?: string;

  // Variables para carga de archivo
  archivoSeleccionado?: File;
  previewEspaciosAcademicos: any[] = [];
  cargandoArchivo: boolean = false;

  mensaje = Utilities;

  listaOpciones = [
    {
      icono: 'pi pi-pencil',
      nombre: 'Editar',
    },
    {
      icono: 'pi pi-trash',
      nombre: 'Eliminar',
    }
  ];

  fg = new FormGroup({
    nombre: new FormControl('', [
      Validators.required
    ]),
    descripcion: new FormControl('', [
      Validators.required
    ]),

  });

  constructor(
    private espacioAcademicoService: EspacioAcademicoService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {

    this.listarEspacioAcademico();
    this.noDocumento = window.sessionStorage.getItem(UtilConstants.NUM_IDENTIFICACION)!;
  }

  //----- Metodos que permiten listar 
  listarEspacioAcademico(): void {
    this.espacioAcademicoService.listarEspaciosAcademicos().subscribe({
      next: (dataespacioacademico) => {
        this.listEspacioAcademico = dataespacioacademico;
      },
      error: (dataerror) => console.error('Error al listar espacios académicos:', dataerror),
    });
  }

  abrirModal(opcion: any, espacioAcademico: IEspacioAcademico): void {
    switch (opcion.nombre) {
      case 'Editar':
        this.abrirEditarModal(espacioAcademico);
        break;
      case 'Eliminar':
        this.eliminar(espacioAcademico);
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
  this.newEspacioAcademico= new EspacioAcademico();
  this.displayCrearEspacioAcademico = true;
}

CargarArchivo(){
  this.displayCargarArchivo = true;
  this.archivoSeleccionado = undefined;
  this.previewEspaciosAcademicos = [];
  this.uploader?.clear();
}

abrirEditarModal(espacioAcademico : EspacioAcademico){
  this.fg.reset();
  this.newEspacioAcademico ={...espacioAcademico };
  this.fg?.get('nombre')?.setValue(espacioAcademico.nombre!);
  this.fg?.get('descripcion')?.setValue(espacioAcademico.descripcion!);
  this.displayEditarEspacioAcademico=true;
}

// -- Metodo de crear -- //

crearEspacoAcademico(){
  this.newEspacioAcademico.nombre =  this.fg?.get('nombre')?.value!;
  this.newEspacioAcademico.descripcion = this.fg?.get('descripcion')?.value!;
  this.newEspacioAcademico.idUsuarioCreacion = this.noDocumento;
  if(this.fg.valid){
    this.espacioAcademicoService.crearEspacioAcademico(this.newEspacioAcademico).subscribe({
      next:(dataespacioacademico) =>{
        this.messageService.add({
          severity: 'success',
          summary: 'CONFIRMACIÓN',
          detail: 'Registro creado con éxito',
        });
        this.espacioAcademico = dataespacioacademico;
        this.listarEspacioAcademico();
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
    this.displayCrearEspacioAcademico= false;
  }else{
    this.mensaje.mensajeError("Error al crear","Es necesario completar todos los campos del formulario para crear.");
  }
}


editarEspacioAcademico(){
  this.newEspacioAcademico.nombre =  this.fg?.get('nombre')?.value!;
  this.newEspacioAcademico.descripcion = this.fg?.get('descripcion')?.value!;
  this.newEspacioAcademico.idUsuarioModificacion = this.noDocumento;
  if(this.fg.valid){
    this.espacioAcademicoService.actualizarEspacioAcademico(this.newEspacioAcademico).subscribe({
      next:(dataespacioacademico) =>{
          this.messageService.add({
            severity: 'success',
            summary: 'CONFIRMACIÓN',
            detail: 'Registro actualizado con éxito',
          }); 
          this.listEspacioAcademico != dataespacioacademico;
          this.listarEspacioAcademico();
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
  this.displayCrearEspacioAcademico = false;
}

cerrarEditarModal(): void {
  this.displayEditarEspacioAcademico = false;
}

cerrarCargarArchivoModal(): void {
  this.displayCargarArchivo = false;
  this.archivoSeleccionado = undefined;
  this.previewEspaciosAcademicos = [];
  this.uploader?.clear();
}

eliminar(espacioAcademico: IEspacioAcademico): void {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción eliminará permanentemente este espacio académico. ¿Deseas continuar?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#26670f",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar"
  }).then((result) => {
    if(result.isConfirmed){
      this.espacioAcademicoService.eliminarEspacioAcademico(espacioAcademico.idEspacioAcademico!).subscribe({
        next:()=>{
          Swal.fire({
            title: "¡Eliminación exitosa!",
            text: "El espacio académico ha sido eliminado correctamente.",
            icon: "success"
          });
          this.listarEspacioAcademico();
        },
        error: (error) => {
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el espacio académico.",
            icon: "error"
          });
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
    this.previewEspaciosAcademicos = this.parsearContenidoArchivo(content);
    
    if (this.previewEspaciosAcademicos.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'ADVERTENCIA',
        detail: 'No se encontraron espacios académicos válidos en el archivo'
      });
    }
  };
  reader.readAsText(this.archivoSeleccionado);
}

parsearContenidoArchivo(content: string): any[] {
  const lineas = content.split('\n').filter(linea => linea.trim() !== '');
  const espaciosAcademicos: any[] = [];

  lineas.forEach((linea, index) => {
    const partes = linea.split(',');
    if (partes.length === 2) {
      const nombre = partes[0].trim();
      const descripcion = partes[1].trim();
      
      if (nombre && descripcion) {
        espaciosAcademicos.push({
          nombre: nombre,
          descripcion: descripcion,
          linea: index + 1
        });
      }
    }
  });

  return espaciosAcademicos;
}

procesarArchivo(): void {
  if (!this.archivoSeleccionado || this.previewEspaciosAcademicos.length === 0) {
    return;
  }

  this.cargandoArchivo = true;
  
  // Convertir previewEspaciosAcademicos a formato de EspacioAcademico
  const espaciosAcademicosParaCrear = this.previewEspaciosAcademicos.map(item => ({
    nombre: item.nombre,
    descripcion: item.descripcion,
    idUsuarioCreacion: this.noDocumento
  }));

  this.espacioAcademicoService.crearEspaciosAcademicosMasivo(espaciosAcademicosParaCrear).subscribe({
    next: (response: any) => {
      this.messageService.add({
        severity: 'success',
        summary: 'ÉXITO',
        detail: `Se cargaron ${response.length} espacios académicos correctamente`
      });
      this.listarEspacioAcademico();
      this.cerrarCargarArchivoModal();
      this.cargandoArchivo = false;
    },
    error: (error: any) => {
      this.messageService.add({
        severity: 'error',
        summary: 'ERROR',
        detail: 'Error al cargar los espacios académicos. Verifique el formato del archivo.'
      });
      this.cargandoArchivo = false;
      console.error('Error al cargar espacios académicos:', error);
    }
  });
}

}
