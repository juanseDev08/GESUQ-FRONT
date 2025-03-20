import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {
  semanaActual!: Date;
  daysInWeek = 7;
  selectedSlot: { date: string; time: string } | null = null;
  display:boolean=false;
  fechaSeleccionada!: String;
  intervaloHorario!: string;
  espacioAcademicoSeleccionado!: any;
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
    '2025-03-18': { '12:00 PM - 2:00 PM': 'Ocupado', '2:00 PM - 4:00 PM': 'Ocupado' },
    '2025-03-19': { '10:00 AM - 12:00 PM': 'Ocupado', '12:00 PM - 2:00 PM': 'Ocupado' },
    '2025-03-20': { '2:00 PM - 4:00 PM': 'Ocupado' },
    '2025-03-22': { '7:00 PM - 9:00 PM': 'Disponible' },
    '2025-03-28': { '7:00 PM - 9:00 PM': 'Disponible' }
  };

  ngOnInit() {
    this.semanaActual = this.obtenerDomingoActual();
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
    this.fechaSeleccionada=this.selectedSlot.date;
    this.intervaloHorario=this.selectedSlot.time;
    console.log(`Seleccionaste: ${fecha.toISOString().split('T')[0]} a las ${time}`);
    this.display=true;
  }

  isSelected(date: Date, time: string) {
    return this.selectedSlot?.date === date.toISOString().split('T')[0] && this.selectedSlot?.time === time;
  }

  asignarEspacioAcademico(espacioAcademico: any) {
    this.espacioAcademicoSeleccionado = espacioAcademico;
    console.log(espacioAcademico);
  }
}
