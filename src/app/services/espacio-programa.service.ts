import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IEspacioPrograma } from '../model/espacio-programa';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspacioProgramaService {

  urlServicio = environment.urlbackend + '/api/espacioPrograma';

  constructor(private http: HttpClient) { }

  public crearEspacioPrograma(espacioPrograma: IEspacioPrograma[]): Observable<any> {
    return this.http.post(this.urlServicio + '/crearEspacioPrograma', espacioPrograma);

  }
  public listarEspacioPrograma(): Observable<IEspacioPrograma[]> {
    return this.http.get<IEspacioPrograma[]>(this.urlServicio + '/listarEspacioPrograma');
  }
  public eliminarEspacioPrograma(idEspacioPrograma: number): Observable<IEspacioPrograma> {
    return this.http.delete(this.urlServicio + '/eliminarEspaProgramaporid/' + idEspacioPrograma);
  }
}
