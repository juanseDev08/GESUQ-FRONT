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


 noDocumento?: string;

 mensaje = Utilities;

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
      error: (dataerror) =>console.error(dataerror),
    });
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


    cerrarCrearModal(){
      this.displayCrearSedeFacultad= false;
    }
  
}
