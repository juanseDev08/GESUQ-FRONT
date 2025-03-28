import { Component, OnInit } from '@angular/core';
import { IUsuario, Usuario } from '../../model/usuario-model';
import { Utilities } from '../../util/utilities';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { MessageService } from 'primeng/api';
import { UtilConstants } from '../../util/util-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss',
  providers: [MessageService],
})
export class UsuarioComponent implements OnInit {

  listUsuarios: IUsuario[] = [];
  usuario?: IUsuario;
  newUsuario: IUsuario = new Usuario();

  displayCrearUsuario: boolean = false;
  displayEditarUsuario: boolean = false;

  filteredOptions?: any[];
  selectedOption: any = null;

  noDocumento?: string;

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
    nombres: new FormControl('', [
      Validators.required
    ]),
    noDocumento: new FormControl('', [
      Validators.required
    ]),
    apellidos: new FormControl('', [
      Validators.required
    ]),
    usuario: new FormControl('', [
      Validators.required
    ]),
    admin: new FormControl(false),
    clave: new FormControl(''),

    activo: new FormControl(false),
  });

  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.listarUsuarios();
    this.noDocumento = window.sessionStorage.getItem(UtilConstants.NUM_IDENTIFICACION)!;
  }


  //----- Metodos que permiten listar 
  listarUsuarios(): void {
    this.usuarioService.listarUsuarios().subscribe({
      next: (datausuario) => {
        this.listUsuarios = datausuario;
      },
      error: (dataerror) => console.log(dataerror),
    });
  }

  abrirModal(opcion: any, usuario: IUsuario): void {
    switch (opcion.nombre) {
      case 'Editar':
        this.abrirEditarModal(usuario);
        break;
      case 'Eliminar':
        this.eliminarUsuario(usuario);
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
    this.newUsuario = new Usuario();
    this.displayCrearUsuario = true;

  }
  abrirEditarModal(usuario: Usuario) {
    this.fg.reset();
    this.newUsuario = { ...usuario };
    this.fg?.get('noDocumento')?.setValue(usuario.noDocumento!);
    this.fg?.get('nombres')?.setValue(usuario.nombres!);
    this.fg?.get('apellidos')?.setValue(usuario.apellidos!);
    this.fg.get('clave')?.setValue('');
    this.fg?.get('usuario')?.setValue(usuario.usuario!);
    this.fg?.get('admin')?.setValue(usuario.admin!);
    this.fg?.get('activo')?.setValue(usuario.activo!);

    const clave = this.fg?.get('clave')?.value?.trim();

  
    if (clave) {
      this.newUsuario.clave = clave;
    } else {
      
      delete this.newUsuario.clave;
    }

    this.displayEditarUsuario = true;

  }

  crearUsuario() {
    this.newUsuario.idUsuarioCreacion = this.noDocumento;
    this.newUsuario.noDocumento = this.fg?.get('noDocumento')?.value!;
    this.newUsuario.nombres = this.fg?.get('nombres')?.value!;
    this.newUsuario.apellidos = this.fg?.get('apellidos')?.value!;
    this.newUsuario.usuario = this.fg?.get('usuario')?.value!;
    this.newUsuario.clave = this.fg?.get('clave')?.value!;
    this.newUsuario.admin = this.fg?.get('admin')?.value!;

    if (this.fg.valid) {
      this.usuarioService.crearUsuario(this.newUsuario).subscribe({
        next: (datausuario) => {
          this.messageService.add({
            severity: 'success',
            summary: 'CONFIRMACION',
            detail: 'Registro creado con exito',
          });
          this.usuario = datausuario;
          this.listarUsuarios();
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
      this.displayCrearUsuario = false;
    } else {
      this.mensaje.mensajeError("Error al crear", "Es necesario completar todos los campos del formulario para crear.")

    }

  }

  editarUsuario() {
    this.newUsuario.idUsuarioModificacion = this.noDocumento;
    this.newUsuario.noDocumento = this.fg?.get('noDocumento')?.value!;
    this.newUsuario.usuario = this.fg?.get('usuario')?.value!;
    this.newUsuario.admin = this.getAdminValue()!;
    this.newUsuario.activo = this.getActivoValue()!;
    
    if((this.fg?.get('nombres')?.value != this.newUsuario.nombres) || (this.fg?.get('apellidos')?.value! != this.newUsuario.apellidos)){
      this.newUsuario.nombres = this.fg?.get('nombres')?.value!;
      this.newUsuario.apellidos = this.fg?.get('apellidos')?.value!;
      location.reload();
    }

    //Asignar la clave antes de enviar
    const clave = this.fg?.get('clave')?.value?.trim();
    if (clave && clave.length > 0) {
      this.newUsuario.clave = clave;
    }
  
    if (this.fg.valid) {
      this.usuarioService.actualizarUsuario(this.newUsuario).subscribe({
        next: datalistausuario => {
          this.messageService.add({
            severity: 'success',
            detail: 'Registro actualizado con éxito',
          });
          this.usuario = datalistausuario;
          this.listarUsuarios();
          this.cerrarEditarModal();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'ERROR',
            detail: 'El registro ingresado ya existe',
          });
        },
      });
    } else {
      this.mensaje.mensajeError("Error al editar", "Es necesario completar todos los campos del formulario para editar.");
    }
  }
  
  eliminarUsuario(usuario: IUsuario) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará permanentemente la sede. ¿Deseas continuar?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#26670f',
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, eliminar"
    }).then((result)=>{
      if(result.isConfirmed){
        console.log("El id es: ", usuario.idUsuario);

        this.usuarioService.eliminarUsuario(usuario.idUsuario!).subscribe({
          next:(datausuario)=>{
            this.listarUsuarios();
          }
        })
        
      }
    })
  }

  //----cerrar modales--//
  cerrarCrearModal(): void {
    this.displayCrearUsuario = false;
  }

  cerrarEditarModal(): void {
    this.displayEditarUsuario = false;

  }

  getActivoValue(): boolean {
    return !!this.fg?.get('activo')?.value;
  }
  getAdminValue(): boolean {
    return !!this.fg?.get('admin')?.value;
  }
  getSeverity(esActivo: boolean): 'success' | 'danger' {
    return esActivo ? 'success' : 'danger';
  }

}
