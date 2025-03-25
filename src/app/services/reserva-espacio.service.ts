import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IReservaEspacio } from '../model/reserva-espacio';

@Injectable({
  providedIn: 'root'
})
export class ReservaEspacioService {

  urlServicio = environment.urlbackend + '/api/reservaEspacio';
  constructor(private http : HttpClient) {}


  public listarReservas(): Observable<IReservaEspacio[]>{
    return this.http.get<IReservaEspacio[]>(this.urlServicio+'/listaReserva');
  }

  public crearReserva(IreservaEspacio: IReservaEspacio): Observable<IReservaEspacio>{
    return this.http.post(this.urlServicio+'/crearReserva', IreservaEspacio);
  }

  public listarReservaPorUsuario(idUsuario: number): Observable<IReservaEspacio[]>{
    return this.http.get<IReservaEspacio[]>(this.urlServicio+'/actualizaPrograma/'+ idUsuario);
  }

  public eliminarReserva(IreservaEspacio: number): Observable<IReservaEspacio>{
    return this.http.delete(this.urlServicio+'/eliminarPrograma/'+IreservaEspacio);
  }
}
