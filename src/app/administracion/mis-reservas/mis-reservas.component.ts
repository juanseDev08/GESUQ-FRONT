import { Component, OnInit } from '@angular/core';
import { ReservaEspacioService } from '../../services/reserva-espacio.service';
import { MessageService } from 'primeng/api';
import { ReservaEspacio } from '../../model/reserva-espacio';
import { Usuario } from '../../model/usuario-model';
import { StorageService } from '../../services/storage.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-mis-reservas',
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.scss',
  providers: [MessageService],
})
export class MisReservasComponent implements OnInit {
  listaReservas: any[] = [];
  usuario?: Usuario;
  displayCancelarReserva: boolean = false;
  fechaSeleccionada!: Date;
  intervaloHorario!: string;
  reservaSeleccionada!: ReservaEspacio;
  espacioAcademicoNombre!: string;

  ngOnInit(): void {
    this.buscarUsuarioPorUsername(this.storageService.getUserName());
  }

  constructor(
    private reservaEspacioService: ReservaEspacioService,
    private storageService: StorageService,
    private usuarioService: UsuarioService
  ) {}

  listarReservas(): void {
    this.reservaEspacioService
      .listarReservaPorUsuario(this.usuario?.idUsuario!)
      .subscribe({
        next: (datareserva) => {
          this.listaReservas = datareserva;
          this.listaReservas.map((reserva) => {
            console.log('reserva', reserva);

            reserva.fechaReservaEspacio =
              reserva.fechaReservaEspacio.split('T')[0];
          });
        },
        error: (dataerror) => console.log(dataerror),
      });
  }

  getSeverity(esActivo: boolean): 'success' | 'danger' {
    return esActivo ? 'success' : 'danger';
  }

  abrirCancelarReservaModal(reserva: ReservaEspacio) {
    this.reservaSeleccionada = reserva;
    this.displayCancelarReserva = true;

    this.fechaSeleccionada = reserva.fechaReservaEspacio!;
    this.intervaloHorario = reserva.horario!;
    this.espacioAcademicoNombre =
      reserva.grupoRelacion?.espacioPrograma?.espacioAcademico?.nombre!;
  }

  cancelarReserva() {
    let reserva = new ReservaEspacio();
    reserva = this.reservaSeleccionada;
    reserva.ocupado = false;
    this.reservaEspacioService.actualizarReserva(reserva).subscribe({
      next: (datareserva) => {
        this.listarReservas();
        this.displayCancelarReserva = false;
      },
      error: (dataerror) => console.log(dataerror),
    });
  }

  buscarUsuarioPorUsername(username: string) {
    this.usuarioService.buscarUsuarioPorUserName(username).subscribe({
      next: (dataUsuario) => {
        this.usuario = dataUsuario;
        this.listarReservas();
      },
    });
  }
}
