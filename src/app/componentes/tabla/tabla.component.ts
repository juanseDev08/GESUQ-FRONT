import { Component, EventEmitter, Input, input, OnInit, Output, ViewChild } from '@angular/core';
import { EspacioAcademicoService } from '../../services/espacio-academico.service';
import { ReservaEspacio } from '../../model/reserva-espacio';
import { UsuarioService } from '../../services/usuario.service';
import { ReservaEspacioService } from '../../services/reserva-espacio.service';
import { StorageService } from '../../services/storage.service';
import { Usuario } from '../../model/usuario-model';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrl: './tabla.component.scss'
})
export class TablaComponent implements OnInit {

  @Input() espacioAcademicoSeleccionado!: any;
  @Input() listaReservas!: ReservaEspacio[];
  @Input()  disponibilidad: { [key: string]: { [key: string]: string } } = {};
  @Output() agendarEvento = new EventEmitter<void>();

  semanaActual!: Date;
  daysInWeek = 7;
  selectedSlot: { date: string; time: string } | null = null;
  display: boolean = false;
  fechaSeleccionada!: string;
  intervaloHorario!: string;
  listEspacioAcademico!: any;
  newReservaEspacio!: ReservaEspacio;
  usuario?: Usuario;

  espaciosAcademicos = [
    { id: 1, nombre: 'Aula Matemáticas' },
    { id: 2, nombre: 'Aula Física' },
    { id: 3, nombre: 'Aula Química' },
    { id: 4, nombre: 'Aula Biología' },
    { id: 5, nombre: 'Aula Historia' },
    { id: 6, nombre: 'Aula Geografía' },
    { id: 7, nombre: 'Aula Lengua Castellana' },
  ];


  listaTiempos = [
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM',
    '7:00 PM - 9:00 PM'
  ];

  /* disponibilidad: { [key: string]: { [key: string]: string } } = {
     '2025-03-18': { '12:00 PM - 2:00 PM': 'Ocupado', '2:00 PM - 4:00 PM': 'Ocupado' },
     '2025-03-19': { '10:00 AM - 12:00 PM': 'Ocupado', '12:00 PM - 2:00 PM': 'Ocupado' },
     '2025-03-20': { '2:00 PM - 4:00 PM': 'Ocupado' },
     '2025-03-22': { '7:00 PM - 9:00 PM': 'Disponible' },
     '2025-03-28': { '7:00 PM - 9:00 PM': 'Disponible' }
   };*/
 

  ngOnInit() {
    this.semanaActual = this.obtenerDomingoActual();
    this.listarEspacioAcademico();
    this.buscarUsuarioPorUsername(this.storageService.getUserName());
    this.listarReservas();
    
  }


  constructor
    (
      private espacioAcademicoService: EspacioAcademicoService,
      private usuarioService: UsuarioService,
      private reservaEspacioService: ReservaEspacioService,
      private storageService: StorageService
    ) {

  }

  obtenerDomingoActual(): Date {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);
    return sunday;
  }

  buscarUsuarioPorUsername(username: string) {
    this.usuarioService.buscarUsuarioPorUserName(username).subscribe({
      next: (dataUsuario) => {

        this.usuario = dataUsuario;
      }
    })
  }
  getCurrentWeek(): { date: Date; label: string }[] {
    return Array.from({ length: this.daysInWeek }, (_, i) => {
      let date = new Date(this.semanaActual);
      date.setDate(this.semanaActual.getDate() + i);
      return {
        date,
        label: date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
      };
    });
  }


  changeWeek(offset: number) {
    this.semanaActual.setDate(this.semanaActual.getDate() + offset * this.daysInWeek);
  }


  obtenerDisponibilidad(date: Date, time: string): string {
    const dateKey = date.toISOString().split('T')[0];
    return this.disponibilidad[dateKey]?.[time] || '';
  }


  onCellClick(fecha: Date, time: string) {
    if (this.obtenerDisponibilidad(fecha, time) === 'Ocupado') return;
    this.selectedSlot = { date: fecha.toISOString().split('T')[0], time };
    this.fechaSeleccionada = this.selectedSlot.date;
    this.intervaloHorario = this.selectedSlot.time;
    this.display = true;
  }

  isSelected(date: Date, time: string) {
    return this.selectedSlot?.date === date.toISOString().split('T')[0] && this.selectedSlot?.time === time;
  }


  listarEspacioAcademico(): void {
    this.espacioAcademicoService.listarEspaciosAcademicos().subscribe({
      next: (dataespacioacademico) => {
        this.listEspacioAcademico = dataespacioacademico;

      },
      error: (dataerror) => console.log(dataerror),
    });
  }

  listarReservas(): void {
    this.reservaEspacioService.listarReservas().subscribe({
      next: (datareserva) => {
        this.listaReservas = datareserva;  
      },
      error: (dataerror) => console.log(dataerror),
    });
  }

  agendar() {
    const newEspacio = new ReservaEspacio();
    newEspacio.espacioAcademico = this.espacioAcademicoSeleccionado;
    newEspacio.fechaReservaEspacio = new Date(this.fechaSeleccionada);
    newEspacio.horario = this.intervaloHorario;
    newEspacio.ocupado = true;
    newEspacio.usuario = this.usuario;
    newEspacio.idUsuarioCreacion = this.usuario?.noDocumento!;


    this.reservaEspacioService.crearReserva(newEspacio).subscribe({
      next: (data) => {
        this.display = false;
        this.listarReservas();
        this.agendarEvento.emit();
      },
      error: (dataerror) => console.log(dataerror),
    });


  }
}
