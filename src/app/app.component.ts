import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'gasuq';
  sidebarVisible: boolean = false;
  items: any[] = [];

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  ngOnInit(): void {
    this.setupMenuItems();
  }
  logout(): void {
    /*
    this.storageService.borrar();
    this.router.navigateByUrl('/login');
    this.autenticado = false;*/
  }
  setupMenuItems(): void {

    this.items = [
      {
        label: 'Inicio',
        routerLink: 'administracion/inicio',
      },
      {
        label: 'Sede',
        routerLink: 'administracion/sede',
      },
      {
        label: 'Espacio academico',
        routerLink: 'administracion/espacio-academico',
      }, {
        label: 'Convenios',
        items: [
          {
            label: 'Facultad',
            routerLink: 'administracion/facultad',
          },
          {
            label: ' Programa',
            routerLink: 'administracion/programa',
          },
          {
            label: 'Facultad y programa',
            routerLink: 'administracion/facultad-programa',
          },
        ],
      },
    ];
  };

  toggleItem(item: any): void {
    item.expanded = !item.expanded;
  }
}
