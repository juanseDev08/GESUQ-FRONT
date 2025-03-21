import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IFacultadPrograma } from '../model/facultad-programa-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacultadProgramaService {
  urlservicio = environment.urlbackend+'/api/facultadPrograma';
  constructor(private http: HttpClient) { }


  public listarFacultadPrograma():Observable<IFacultadPrograma[]>{
    return this.http.get<IFacultadPrograma[]>(this.urlservicio +'/listarFacultadPrograma')
  }
  public listarFacultadProgramaPorIdFacultad(ICodFacultad : number):Observable<IFacultadPrograma[]>{
    return this.http.get<IFacultadPrograma[]>(this.urlservicio +'/listarPorFacultad/'+ ICodFacultad);
  }
  public crearFacultadPrograma(Ifacultaprograma : IFacultadPrograma[]) :Observable<any>{
    return this.http.post(this.urlservicio+'/crearFacultaPrograma', Ifacultaprograma);
  }

  public eliminarFacultadPrograma(ICodPrograma : string):Observable<IFacultadPrograma>{
    return this.http.delete(this.urlservicio+'/eliminarFacultadPrograma/'+ ICodPrograma);
  }
  
}
