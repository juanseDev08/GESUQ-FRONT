import { Component, OnInit } from '@angular/core';
import { StorageService } from './services/storage.service';
import { UsuarioService } from './services/usuario.service';

import { Router } from '@angular/router';
import { UtilConstants } from './util/util-constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'gesuq';
  sidebarVisible: boolean = false;
  items: any[] = [];
  autenticado = false;

  nombreUsuario?: string;

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }
  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.autenticado = this.storageService.autenticado();
    if (this.autenticado) {
      this.buscarUsuarioPorUsername(this.storageService.getUserName());
      this.setupMenuItems();
    }
  }
  logout(): void {
    this.storageService.borrar();
    this.router.navigateByUrl('/login');
    this.autenticado = false;
  }
  setupMenuItems(): void {
    this.items = [
      {
        label: 'Inicio',
        routerLink: 'administracion/inicio',
      },

      {
        label: 'Espacio academico',
        routerLink: 'administracion/espacio-academico',
      },
      {
        label: 'Grupo',
        routerLink: 'administracion/grupo',
      },
      {
        label: 'Semestre',
        routerLink: 'administracion/semestre',
      },
      {
        label: 'Usuario',
        routerLink: 'administracion/usuario',
      },
      {
        label: 'Grupo Relacion',
        routerLink: 'administracion/grupo-relacion',
      },

      {
        label: 'Programas y Espacios',
        routerLink: 'administracion/espacio-programa',
      },

      {
        label: 'Facultad',
        items: [
          {
            label: 'Facultad',
            routerLink: 'administracion/facultad',
          },
          {
            label: 'Programa',
            routerLink: 'administracion/programa',
          },
          {
            label: 'Facultad y programa',
            routerLink: 'administracion/facultad-programa',
          },
        ],
      },
      {
        label: 'Sede',
        items: [
          {
            label: 'Sede',
            routerLink: 'administracion/sede',
          },
          {
            label: 'Sede y facultad',
            routerLink: 'administracion/sede-facultad',
          },
        ],
      },
    ];
  }

  buscarUsuarioPorUsername(username: string) {
    this.usuarioService.buscarUsuarioPorUserName(username).subscribe({
      next: (dataUsuario) => {
        window.sessionStorage.setItem(
          UtilConstants.NUM_IDENTIFICACION,
          dataUsuario.noDocumento!
        );
        this.nombreUsuario = dataUsuario.nombres + ' ' + dataUsuario.apellidos;
      },
    });
  }

  toggleItem(item: any): void {
    item.expanded = !item.expanded;
  }
}
