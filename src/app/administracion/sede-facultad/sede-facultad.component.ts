import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Sede } from '../../model/sede-model';
import { Facultad } from '../../model/facultad-model';
import { ISedeFacultad, SedeFacultad } from '../../model/sede-facultad';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SedeService } from '../../services/sede.service';
import { FacultadService } from '../../services/facultad.service';
import { SedeFacultadService } from '../../services/sede-facultad.service';
import { UtilConstants } from '../../util/util-constants';
import { Utilities } from '../../util/utilities';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sede-facultad',
  templateUrl: './sede-facultad.component.html',
  styleUrl: './sede-facultad.component.scss',
  providers: [MessageService]
})
export class SedeFacultadComponent implements OnInit {
 @ViewChild('tablaProgramas') tablaProgramas!: Table;
 listSedes: Sede []=[];
 listFacultades: Facultad []=[];
 listaSedeFacultad: ISedeFacultad[]=[];
 newSedeFacultad?: SedeFacultad;

 sedeSeleccionada?: Sede;
 facultadesSeleccionadas?: Facultad[]=[];

 displayCrearSedeFacultad: boolean = false;
 displayCargarArchivo: boolean = false;

 filteredOptions?: any[];
 selectedOption: any = null;

 noDocumento?: string;

 // Variables para carga de archivo
 archivoSeleccionado?: File;
 previewSedeFacultades: any[] = [];
 cargandoArchivo: boolean = false;

 mensaje = Utilities;

 listaOpciones = [
   {
     icono: 'pi pi-trash',
     nombre: 'Eliminar',
   }
 ];

  fg = new FormGroup({
     sede: new FormControl(0, [
       Validators.required
     ]),
     facultad: new FormControl<Facultad[]>([]),
   })
 
  constructor(
    private sedeService : SedeService,
    private facultadService : FacultadService,
    private messageService: MessageService,
    private sedeFacultadService : SedeFacultadService
  ){}

  ngOnInit(): void {
    this.listarSedeFacultad();
    this.listarSedes();
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

  listarSedes(){
    this.sedeService.listarSedes().subscribe({
      next:(datasede)=>{
        this.listSedes = datasede;
        this.listarFacultades();
      },
      error: (dataerror) => console.log(dataerror),
    });
  }

  listarSedeFacultad(){
    this.listaSedeFacultad =[];
    this.sedeFacultadService.listarSedeFacultad().subscribe({
      next: (datasedefacultad)=>{
        this.listaSedeFacultad = datasedefacultad;
        console.log("lista ", this.listaSedeFacultad);
        
      },
      error: (dataerror) =>console.error('Error al listar sede-facultades:', dataerror),
    });
  }

  abrirModal(opcion: any, sedeFacultad: ISedeFacultad): void {
    switch (opcion.nombre) {
      case 'Eliminar':
        this.eliminar(sedeFacultad);
        break;
      default:
        break;
    }
    setTimeout(() => {
      this.selectedOption = null;
    }, 0);
  }

  sedeSelecconada(event:any){
    console.log("LA sede seleccionada es: ", event);
    
    if(event){
      this.sedeSeleccionada = this.listSedes.find((sede)=> sede.idSede === event)!;
      this.listarFacultades();
    }else{
      this.sedeSeleccionada = undefined;
    }
  }

  asignarFacultades(facultad: Facultad[]) {
    this.facultadesSeleccionadas= facultad;
  }

  crearSedeFacultad(){

    const sedeFacultades: SedeFacultad[] = this.facultadesSeleccionadas!.map(facultad => ({
      sede: this.sedeSeleccionada,
      facultad: facultad,
      idUsuarioCreacion: this.noDocumento,
  }));

  if(this.fg.valid){
    this.sedeFacultadService.crearSedeFacultad(sedeFacultades).subscribe({
      next:(datasedefacultad) =>{
        this.messageService.add({
          severity: 'success',
          summary: 'CONFIRMACIÓN',
          detail: 'Registro creado con éxito',
        });
        this.listarSedeFacultad();
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
    this.displayCrearSedeFacultad=false;
  }else{
    this.mensaje.mensajeError("Error al crear","Es necesario completar todos los campos del formulario para crear.");
  }
    
  }

  eliminar( sedeFacultad : SedeFacultad){
    Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará permanentemente esta relación. ¿Deseas continuar?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#26670f",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Si, eliminar"
          }).then((result) => {
            if (result.isConfirmed) {
              this.sedeFacultadService.eliminarSedeFacultad(sedeFacultad.idsedefacultad!).subscribe({
                next:(datasedefacultad)=>{
                  this.listarSedeFacultad();
                }
              });
            }
          });
  }

    //---- Abrir modales ----//
    abrirCrearModal(): void {
      this.fg.reset();
      this.newSedeFacultad = new SedeFacultad();
      this.displayCrearSedeFacultad = true;
    }

    CargarArchivo(){
      this.displayCargarArchivo = true;
      this.archivoSeleccionado = undefined;
      this.previewSedeFacultades = [];
    }

    cerrarCrearModal(){
      this.displayCrearSedeFacultad= false;
    }

    cerrarCargarArchivoModal(): void {
      this.displayCargarArchivo = false;
      this.archivoSeleccionado = undefined;
      this.previewSedeFacultades = [];
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
        this.previewSedeFacultades = this.parsearContenidoArchivo(content);
        
        if (this.previewSedeFacultades.length === 0) {
          this.messageService.add({
            severity: 'warn',
            summary: 'ADVERTENCIA',
            detail: 'No se encontraron relaciones sede-facultad válidas en el archivo'
          });
        }
      };
      reader.readAsText(this.archivoSeleccionado);
    }

    parsearContenidoArchivo(content: string): any[] {
      const lineas = content.split('\n').filter(linea => linea.trim() !== '');
      const sedeFacultades: any[] = [];

      lineas.forEach((linea, index) => {
        const partes = linea.split(',');
        if (partes.length === 2) {
          const nombreSede = partes[0].trim();
          const nombreFacultad = partes[1].trim();
          
          if (nombreSede && nombreFacultad) {
            sedeFacultades.push({
              nombreSede: nombreSede,
              nombreFacultad: nombreFacultad,
              linea: index + 1
            });
          }
        }
      });

      return sedeFacultades;
    }

    procesarArchivo(): void {
      if (!this.archivoSeleccionado || this.previewSedeFacultades.length === 0) {
        return;
      }

      this.cargandoArchivo = true;
      
      // Convertir previewSedeFacultades a formato de SedeFacultad
      const sedeFacultadesParaCrear = this.previewSedeFacultades.map(item => {
        const sede = this.listSedes.find(s => s.nombreSede === item.nombreSede);
        const facultad = this.listFacultades.find(f => f.nombreFacultad === item.nombreFacultad);
        
        return {
          sede: sede,
          facultad: facultad,
          idUsuarioCreacion: this.noDocumento
        };
      }).filter(item => item.sede && item.facultad);

      this.sedeFacultadService.crearSedeFacultadesMasivo(sedeFacultadesParaCrear).subscribe({
        next: (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'ÉXITO',
            detail: `Se cargaron ${response.length} relaciones sede-facultad correctamente`
          });
          this.listarSedeFacultad();
          this.cerrarCargarArchivoModal();
          this.cargandoArchivo = false;
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'ERROR',
            detail: 'Error al cargar las relaciones sede-facultad. Verifique el formato del archivo.'
          });
          this.cargandoArchivo = false;
          console.error('Error al cargar sede-facultades:', error);
        }
      });
    }
  
}
