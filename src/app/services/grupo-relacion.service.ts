import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IGrupoRelacion } from '../model/grupo-relacion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrupoRelacionService {

  urlServicio = environment.urlbackend + '/api/grupoRelacion'

  constructor(private http: HttpClient) { }

  public crearGrupoRelacion(Igruporelacion: IGrupoRelacion): Observable<any> {
    return this.http.post(this.urlServicio + '/crearGrupoRelacion', Igruporelacion)
  }

  public listarGrupoRelacion(): Observable<IGrupoRelacion[]> {
    return this.http.get<IGrupoRelacion[]>(this.urlServicio + '/listarGrupoRelacion')
  }

  public eliminarGrupoRelacion(Igruporelacion: number): Observable<IGrupoRelacion> {
    return this.http.delete(this.urlServicio + '/eliminarGrupoRelacion/' + Igruporelacion)
  }
  public eliminarGrupoRelacionPorGrupo(Idgrupo: number): Observable<IGrupoRelacion> {
    return this.http.delete(this.urlServicio + '/eliminarGrupoRelacionporGrupo/' + Idgrupo)
  }
}
