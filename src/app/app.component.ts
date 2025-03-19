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
          label: 'Proyecto',
          routerLink: 'administracion/proyecto',
        },
        {
          label: 'Tipos de proyectos',
          routerLink: 'administracion/tipo-proyecto',
        },
        {
          label: 'Comunidad objetivo',
          routerLink: 'administracion/comunidad-objetivo',
        },
        {
          label: ' Áreas solicitantes',
          routerLink: 'administracion/area-solicitante',
        },
        {
          label: 'Costos',
          routerLink: 'administracion/tipo-costo',
        },
        {
          label: 'Acto administrativo',
          routerLink: 'administracion/acto-administrativo',
        },
        {
          label: 'Facultad programa',
          routerLink: 'administracion/facultad-programa',
        }];
      };

      toggleItem(item: any): void {
        item.expanded = !item.expanded;
      }
}
