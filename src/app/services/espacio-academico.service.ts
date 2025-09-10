import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IEspacioAcademico } from '../model/espacio-academico';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspacioAcademicoService {
 
  urlServicio = environment.urlbackend+'/api/espacioAcademico'  
  constructor(private http : HttpClient) { }

  public crearEspacioAcademico(Iespacioacademico : IEspacioAcademico): Observable<IEspacioAcademico>{
    return this.http.post(this.urlServicio+'/crearEspacioAcademico',Iespacioacademico);
  }

  public listarEspaciosAcademicos():Observable<IEspacioAcademico[]>{
    return this.http.get<IEspacioAcademico[]>(this.urlServicio+'/listarEspacioAcademico');
  }

  public actualizarEspacioAcademico(Iespacioacademico : IEspacioAcademico): Observable<IEspacioAcademico>{
    return this.http.put(this.urlServicio+'/actualizarEspacioAcademico', Iespacioacademico);
  }

  public eliminarEspacioAcademico(Iespacioacademico : number) :Observable<IEspacioAcademico>{
    return this.http.delete(this.urlServicio+'/eliminarEspacioAcademico/'+Iespacioacademico);
  }

  public crearEspaciosAcademicosMasivo(espaciosAcademicos: any[]): Observable<IEspacioAcademico[]>{
    return this.http.post<IEspacioAcademico[]>(this.urlServicio+'/crearEspaciosAcademicosMasivo', espaciosAcademicos);
  }
}
