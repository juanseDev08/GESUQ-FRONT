import { Component, OnInit, Output } from '@angular/core';
import { EspacioAcademicoService } from '../../services/espacio-academico.service';
import { ReservaEspacioService } from '../../services/reserva-espacio.service';
import { ReservaEspacio } from '../../model/reserva-espacio';
import { EspacioAcademico } from '../../model/espacio-academico';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {

  @Output() espacioAcademicoSeleccionado!: EspacioAcademico;

  semanaActual!: Date;
  daysInWeek = 7;
  selectedSlot: { date: string; time: string } | null = null;
  display: boolean = false;
  fechaSeleccionada!: String;
  intervaloHorario!: string;
  listEspacioAcademico!: any;
  listaReservas!: ReservaEspacio[];
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

  disponibilidad: { [key: string]: { [key: string]: string } } = {
  };

  ngOnInit() {
    this.semanaActual = this.obtenerDomingoActual();
    this.listarEspacioAcademico();
    this.listarReservas();
  }


  constructor(private espacioAcademicoService: EspacioAcademicoService, private reservaEspacioService: ReservaEspacioService, private router: Router) {

  }

  obtenerDomingoActual(): Date {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);
    return sunday;
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

  asignarEspacioAcademico(espacioAcademico: EspacioAcademico) {
    this.disponibilidad = {};
    this.espacioAcademicoSeleccionado = espacioAcademico

    this.listaReservas.map((reserva) => {
      if (reserva.espacioAcademico?.idEspacioAcademico===this.espacioAcademicoSeleccionado.idEspacioAcademico) {
      
          const llave = new Date(reserva.fechaReservaEspacio!).toISOString().split('T')[0];
          if (!this.disponibilidad[llave]) {
            this.disponibilidad[llave] = {};
          }
          this.disponibilidad[llave][reserva.horario!] = reserva.ocupado ? 'Ocupado' : 'Disponible';
        
      }
    });
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
       if(this.espacioAcademicoSeleccionado){
        this.asignarEspacioAcademico(this.espacioAcademicoSeleccionado);
        }
      },
      error: (dataerror) => console.log(dataerror),
    });
  }
  irAMisReservas() {
    this.router.navigate(['/administracion/mis-reservas']);
  }
}
