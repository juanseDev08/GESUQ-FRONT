import { Component, OnInit, ViewChild } from '@angular/core';
import { Isede, Sede } from '../../model/sede-model';
import { Utilities } from '../../util/utilities';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SedeService } from '../../services/sede.service';
import { MessageService } from 'primeng/api';
import { UtilConstants } from '../../util/util-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sede',
  templateUrl: './sede.component.html',
  styleUrl: './sede.component.scss',
  providers: [MessageService],
})
export class SedeComponent implements OnInit {

  listSedes: Isede[] = [];
  sede?: Isede;
  newSede: Sede = new Sede();

  displayCrearSede: boolean = false;
  displayEditarSede: boolean = false;
  displayCargarArchivo: boolean = false;

  filteredOptions?: any[];
  selectedOption: any = null;

  noDocumento?: string;

  // Variables para carga de archivo
  archivoSeleccionado?: File;
  previewSedes: any[] = [];
  cargandoArchivo: boolean = false;

  mensaje = Utilities;

  listaOpciones = [
    {
      icono: 'pi pi-pencil',
      nombre: 'Editar',
      tooltip: 'Abrir modal para editar la sede',
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
    ubicacion: new FormControl('', [
      Validators.required
    ]),
  });

  constructor(
    private sedeService: SedeService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.listarSedes();
    this.noDocumento = window.sessionStorage.getItem(UtilConstants.NUM_IDENTIFICACION)!;
  }

  //----- Metodos que permiten listar 

  listarSedes(): void {
    this.listSedes = []; 
    this.sedeService.listarSedes().subscribe({
      next: (datasede) => {
        this.listSedes = datasede;
      },
      error: (error) =>   console.error('Error al listar sedes:', error) 
    });
  }

  abrirModal(opcion: any, sede: Isede): void {
    switch (opcion.nombre) {
      case 'Editar':
        this.abrirEditarModal(sede);
        break;
      case 'Eliminar':
        this.eliminar(sede);
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
    this.newSede = new Sede();
    this.displayCrearSede = true;
  }

  CargarArchivo(){
    this.displayCargarArchivo = true;
    this.archivoSeleccionado = undefined;
    this.previewSedes = [];
  }

  abrirEditarModal(sede: Sede) {
    this.fg.reset();
    this.newSede = { ...sede };
    this.fg?.get('nombre')?.setValue(sede.nombreSede!);
    this.fg?.get('ubicacion')?.setValue(sede.ubicacion!);
    this.displayEditarSede = true;

  }
  // -- Metodo de crear -- //
  crearSede() {
    this.newSede.nombreSede = this.fg?.get('nombre')?.value!;
    this.newSede.ubicacion = this.fg?.get('ubicacion')?.value!;
    this.newSede.idUsuarioCreacion = this.noDocumento;
    if (this.fg.valid) {
      this.sedeService.crearSede(this.newSede).subscribe({
        next: (datasede) => {
          this.messageService.add({
            severity: 'success',
            summary: 'CONFIRMACION',
            detail: 'Registro creado con exito',
          });
          this.sede = datasede;
          this.listarSedes();
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
      this.displayCrearSede = false;
    } else {
      this.mensaje.mensajeError("Error al crear", "Es necesario completar todos los campos del formulario para crear.")
    }

  }

  editarSede(): void {
    this.newSede.nombreSede = this.fg?.get('nombre')?.value!;
    this.newSede.ubicacion = this.fg?.get('ubicacion')?.value!;
    this.newSede.idUsuarioModificacion = this.noDocumento;
    if (this.fg.valid) {
      this.sedeService.actualizarSede(this.newSede).subscribe({
        next:(datasede)=>{
          this.messageService.add({
            severity:'success',
            summary:'CONFIRMACION',
            detail:'Registro actualizado con exito',
          });
          this.listSedes != datasede;
          this.listarSedes();
          this.cerrarEditarModal();
        },
        error:(dataerror)=>{
          this.messageService.add({
            severity:'error',
            summary:'ERROR',
            detail:'El registro ingresado ya existe'
          });
        },
      });
    } else {
      this.mensaje.mensajeError("Error al editar", "Es necesario completar todos los campos del formulario para editar.");
    }
  }
 
  eliminar(sede :Isede){
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará permanentemente la sede. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#26670f",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("El id es: ", sede.idSede);
        
        this.sedeService.eliminarSede(sede.idSede!).subscribe({
          next:(datasede)=>{
            this.listarSedes();
          }
        });
      }
    });
  }

  //----cerrar modales--//
  cerrarCrearModal(): void {
    this.displayCrearSede = false;
  }

  cerrarEditarModal(): void {
    this.displayEditarSede = false;
  }

  cerrarCargarArchivoModal(): void {
    this.displayCargarArchivo = false;
    this.archivoSeleccionado = undefined;
    this.previewSedes = [];
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
      this.previewSedes = this.parsearContenidoArchivo(content);
      
      if (this.previewSedes.length === 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'ADVERTENCIA',
          detail: 'No se encontraron sedes válidas en el archivo'
        });
      }
    };
    reader.readAsText(this.archivoSeleccionado);
  }

  parsearContenidoArchivo(content: string): any[] {
    const lineas = content.split('\n').filter(linea => linea.trim() !== '');
    const sedes: any[] = [];

    lineas.forEach((linea, index) => {
      const partes = linea.split(',');
      if (partes.length === 2) {
        const nombre = partes[0].trim();
        const ubicacion = partes[1].trim();
        
        if (nombre && ubicacion) {
          sedes.push({
            nombre: nombre,
            ubicacion: ubicacion,
            linea: index + 1
          });
        }
      }
    });

    return sedes;
  }

  procesarArchivo(): void {
    if (!this.archivoSeleccionado || this.previewSedes.length === 0) {
      return;
    }

    this.cargandoArchivo = true;
    
    // Convertir previewSedes a formato de Sede
    const sedesParaCrear = this.previewSedes.map(sede => ({
      nombreSede: sede.nombre,
      ubicacion: sede.ubicacion,
      idUsuarioCreacion: this.noDocumento
    }));

    this.sedeService.crearSedesMasivo(sedesParaCrear).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'ÉXITO',
          detail: `Se cargaron ${response.length} sedes correctamente`
        });
        this.listarSedes();
        this.cerrarCargarArchivoModal();
        this.cargandoArchivo = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'ERROR',
          detail: 'Error al cargar las sedes. Verifique el formato del archivo.'
        });
        this.cargandoArchivo = false;
        console.error('Error al cargar sedes:', error);
      }
    });
  }


}
