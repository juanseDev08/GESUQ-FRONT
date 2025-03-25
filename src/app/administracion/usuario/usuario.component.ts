import { Component, OnInit } from '@angular/core';
import { IUsuario, Usuario } from '../../model/usuario-model';
import { Utilities } from '../../util/utilities';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { MessageService } from 'primeng/api';
import { UtilConstants } from '../../util/util-constants';

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

  noDocumento?: string;

  mensaje = Utilities;

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
    clave: new FormControl('', [
      Validators.required
    ]),
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
    this.fg?.get('usuario')?.setValue(usuario.usuario!);    
    this.fg?.get('admin')?.setValue(usuario.admin!);
    

  }

  crearUsuario(){

    this.newUsuario.idUsuarioCreacion = this.noDocumento;
    console.log('Formulario antes de validar:', this.fg.value);
    console.log('Errores del formulario:', this.fg.errors);
    console.log('Estado del formulario:', this.fg.valid);

    this.newUsuario.noDocumento=this.fg?.get('noDocumento')?.value!;
    this.newUsuario.nombres=this.fg?.get('nombres')?.value!;
    this.newUsuario.apellidos=this.fg?.get('apellidos')?.value!;
    this.newUsuario.usuario=this.fg?.get('usuario')?.value!;
    this.newUsuario.clave=this.fg?.get('clave')?.value!;
    this.newUsuario.admin = this.fg?.get('admin')?.value!;
   

    
    if (this.fg.valid) {

     
      
      this.usuarioService.crearUsuario(this.newUsuario).subscribe({
        next:(datausuario)=>{
          this.messageService.add({
            severity:'success',
            summary:'CONFIRMACION',
            detail:'Registro creado con exito',
          });
          this.usuario=datausuario;
          this.listarUsuarios();
          this.cerrarCrearModal();
        },
        error:(dataerror)=>{
          this.messageService.add({
            severity:'error',
            summary:'ERROR',
            detail:'El registro ingresado ya existe',
          });
        },
      });
      this.displayCrearUsuario=false;
    } else {
     this.mensaje.mensajeError("Error al crear","Es necesario completar todos los campos del formulario para crear.")
   
    }
    
  }

    //----cerrar modales--//
    cerrarCrearModal(): void {
      this.displayCrearUsuario = false;
    }
  
    cerrarEditarModal(): void {
      this.displayEditarUsuario = false;
  
    }

}
