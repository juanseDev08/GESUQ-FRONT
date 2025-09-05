import { Component, Input, OnInit, Output } from '@angular/core';
import { EspacioAcademicoService } from '../../services/espacio-academico.service';
import { ReservaEspacioService } from '../../services/reserva-espacio.service';
import { ReservaEspacio } from '../../model/reserva-espacio';
import { EspacioAcademico } from '../../model/espacio-academico';
import { Router } from '@angular/router';
import { Sede } from '../../model/sede-model';
import { Facultad } from '../../model/facultad-model';
import { Programa } from '../../model/programa-model';
import { GrupoRelacion } from '../../model/grupo-relacion';
import { GrupoRelacionService } from '../../services/grupo-relacion.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss',
})
export class InicioComponent implements OnInit {
  /* @Output() espacioAcademicoSeleccionado!: EspacioAcademico; */
  @Output() grupoRelacionSeleccionado!: GrupoRelacion;

  semanaActual!: Date;
  daysInWeek = 7;
  selectedSlot: { date: string; time: string } | null = null;
  display: boolean = false;
  fechaSeleccionada!: String;
  intervaloHorario!: string;
  listEspacioAcademico!: any;
  listaReservas!: ReservaEspacio[];
  grupoRelaciones: GrupoRelacion[] = [];

  listaSedes: Sede[] = [];
  listaFacultades: Facultad[] = [];
  listaProgramas: Programa[] = [];
  listaEspacios: EspacioAcademico[] = [];
  facultadesFiltradas: Facultad[] = [];
  programasFiltrados: Programa[] = [];
  espaciosFiltrados: EspacioAcademico[] = [];

  selectedSede!: Sede;
  selectedFacultad!: Facultad;
  selectedPrograma!: Programa;
  selectedEspacio!: EspacioAcademico;
  /* grupoRelacionSeleccionado!: GrupoRelacion; */

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
    '8:00 AM - 9:00 AM',
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '4:00 PM - 5:00 PM',
    '5:00 PM - 6:00 PM',
    '6:00 PM - 7:00 PM',
    '7:00 PM - 8:00 PM',
    '8:00 PM - 9:00 PM',
   
  ];

  disponibilidad: { [key: string]: { [key: string]: string } } = {};

  ngOnInit() {
    this.semanaActual = this.obtenerDomingoActual();
    /*  this.listarEspacioAcademico(); */
    this.listarReservas();
    this.listarGrupoRelaciones();
  }

  constructor(
    private grupoRelacionService: GrupoRelacionService,
    private reservaEspacioService: ReservaEspacioService,
    private router: Router
  ) {}

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
        label: date.toLocaleDateString('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        }),
      };
    });
  }

  changeWeek(offset: number) {
    this.semanaActual.setDate(
      this.semanaActual.getDate() + offset * this.daysInWeek
    );
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
    return (
      this.selectedSlot?.date === date.toISOString().split('T')[0] &&
      this.selectedSlot?.time === time
    );
  }

  /*   asignarEspacioAcademico(espacioAcademico: EspacioAcademico) {
    this.disponibilidad = {};
    this.espacioAcademicoSeleccionado = espacioAcademico;

    this.listaReservas.map((reserva) => {
      if (
        reserva.espacioAcademico?.idEspacioAcademico ===
        this.espacioAcademicoSeleccionado.idEspacioAcademico
      ) {
        const llave = new Date(reserva.fechaReservaEspacio!)
          .toISOString()
          .split('T')[0];
        if (!this.disponibilidad[llave]) {
          this.disponibilidad[llave] = {};
        }
        this.disponibilidad[llave][reserva.horario!] = reserva.ocupado
          ? 'Ocupado'
          : 'Disponible';
      }
    });
  } */

  asignarGrupoRelacion() {
    if (
      this.grupoRelaciones &&
      this.grupoRelaciones.length > 0 &&
      this.selectedSede &&
      this.selectedFacultad &&
      this.selectedPrograma &&
      this.selectedEspacio
    ) {
      const resultado = this.grupoRelaciones.find(
        (gr) =>
          gr.sede?.idSede === this.selectedSede.idSede &&
          gr.facultad?.idFacultad === this.selectedFacultad.idFacultad &&
          gr.espacioPrograma?.programa?.idPrograma ===
            this.selectedPrograma.idPrograma &&
          gr.espacioPrograma?.espacioAcademico?.idEspacioAcademico ===
            this.selectedEspacio.idEspacioAcademico
      );

      if (resultado) {
        this.grupoRelacionSeleccionado = resultado;

        // Aquí actualizar disponibilidad:
        this.disponibilidad = {}; // Reinicia el estado

        if (this.listaReservas && this.listaReservas.length > 0) {
          this.listaReservas.forEach((reserva) => {
            if (
              reserva.grupoRelacion?.idGrupoRelacion ===
              this.grupoRelacionSeleccionado.idGrupoRelacion
            ) {
              const fechaStr = new Date(reserva.fechaReservaEspacio!)
                .toISOString()
                .split('T')[0];
              if (!this.disponibilidad[fechaStr]) {
                this.disponibilidad[fechaStr] = {};
              }
              this.disponibilidad[fechaStr][reserva.horario!] = reserva.ocupado
                ? 'Ocupado'
                : 'Disponible';
            }
          });
        }
      } else {
        console.warn('No se encontró una coincidencia en grupoRelacion');
        this.grupoRelacionSeleccionado;
        this.disponibilidad = {};
      }
    } else {
      console.warn(
        'Faltan datos para asignar grupoRelacion o lista está vacía'
      );
    }
  }

  buscarGrupoRelacion(): void {
    this.grupoRelacionSeleccionado = this.grupoRelaciones.find(
      (gr) =>
        gr.sede?.idSede === this.selectedSede?.idSede &&
        gr.facultad?.idFacultad === this.selectedFacultad?.idFacultad &&
        gr.espacioPrograma?.programa?.idPrograma ===
          this.selectedPrograma?.idPrograma &&
        gr.espacioPrograma?.espacioAcademico?.idEspacioAcademico ===
          this.selectedEspacio?.idEspacioAcademico
    )!;

    if (this.grupoRelacionSeleccionado) {
      this.asignarGrupoRelacion();
    }
  }
  /*   listarEspacioAcademico(): void {
    this.espacioAcademicoService.listarEspaciosAcademicos().subscribe({
      next: (dataespacioacademico) => {
        this.listEspacioAcademico = dataespacioacademico;

      },
      error: (dataerror) => console.log(dataerror),
    });
  } */

  listarGrupoRelaciones(): void {
    this.grupoRelacionService.listarGrupoRelacion().subscribe({
      next: (data) => {
        this.grupoRelaciones = data;

        this.listaSedes = this.getUnique(
          this.grupoRelaciones.map((gr) => gr.sede),
          'idSede'
        );

        this.listaFacultades = this.getUnique(
          this.grupoRelaciones.map((gr) => gr.facultad),
          'idFacultad'
        );

        this.listaProgramas = this.getUnique(
          this.grupoRelaciones.map((gr) => gr.espacioPrograma?.programa),
          'idPrograma'
        );

        this.listaEspacios = this.getUnique(
          this.grupoRelaciones.map(
            (gr) => gr.espacioPrograma?.espacioAcademico
          ),
          'idEspacioAcademico'
        );
      },
      error: (error) => console.log(error),
    });
  }

  /*   listarReservas(): void {
    this.reservaEspacioService.listarReservas().subscribe({
      next: (datareserva) => {
        this.listaReservas = datareserva;
        if (this.espacioAcademicoSeleccionado) {
          this.asignarEspacioAcademico(this.espacioAcademicoSeleccionado);
        }
      },
      error: (dataerror) => console.log(dataerror),
    });
  } */
  filtrarFacultadesPorSede() {
    if (!this.selectedSede) {
      this.facultadesFiltradas = [];
      return;
    }

    this.facultadesFiltradas = this.getUnique(
      this.grupoRelaciones
        .filter((gr) => gr.sede?.idSede === this.selectedSede.idSede)
        .map((gr) => gr.facultad),
      'idFacultad'
    );

    // Limpia selecciones posteriores
    this.selectedFacultad = undefined!;
    this.selectedPrograma = undefined!;
    this.selectedEspacio = undefined!;
    this.programasFiltrados = [];
    this.espaciosFiltrados = [];
  }
  filtrarProgramasPorSedeYFacultad() {
    if (!this.selectedSede || !this.selectedFacultad) {
      this.programasFiltrados = [];
      return;
    }

    this.programasFiltrados = this.getUnique(
      this.grupoRelaciones
        .filter(
          (gr) =>
            gr.sede?.idSede === this.selectedSede.idSede &&
            gr.facultad?.idFacultad === this.selectedFacultad.idFacultad
        )
        .map((gr) => gr.espacioPrograma?.programa),
      'idPrograma'
    );

    this.selectedPrograma = undefined!;
    this.selectedEspacio = undefined!;
    this.espaciosFiltrados = [];
  }

  listarReservas(): void {
    this.reservaEspacioService.listarReservas().subscribe({
      next: (datareserva) => {
        this.listaReservas = datareserva;
        if (this.grupoRelacionSeleccionado) {
          this.asignarGrupoRelacion();
        }
      },
      error: (dataerror) => console.log(dataerror),
    });
  }
  filtrarEspacios() {
    if (
      !this.selectedSede ||
      !this.selectedFacultad ||
      !this.selectedPrograma
    ) {
      this.espaciosFiltrados = [];
      return;
    }

    this.espaciosFiltrados = this.getUnique(
      this.grupoRelaciones
        .filter(
          (gr) =>
            gr.sede?.idSede === this.selectedSede.idSede &&
            gr.facultad?.idFacultad === this.selectedFacultad.idFacultad &&
            gr.espacioPrograma?.programa?.idPrograma ===
              this.selectedPrograma.idPrograma
        )
        .map((gr) => gr.espacioPrograma?.espacioAcademico),
      'idEspacioAcademico'
    );

    this.selectedEspacio = undefined!;
  }

  irAMisReservas() {
    this.router.navigate(['/administracion/mis-reservas']);
  }

  getUnique<T>(arr: (T | undefined)[], idKey: keyof T): T[] {
    const seen = new Set();
    return arr.filter((item): item is T => {
      if (!item) return false;
      const id = item[idKey];
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }
}
