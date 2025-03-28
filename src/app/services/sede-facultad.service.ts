import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ISedeFacultad } from '../model/sede-facultad';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SedeFacultadService {
  urlServicio = environment.urlbackend+'/api/sedeFacultad';

  constructor(private http : HttpClient ) { }

  public crearSedeFacultad(Isedefacultad : ISedeFacultad[]):Observable<any>
  {
    return this.http.post(this.urlServicio+'/crearSedeFaculta',Isedefacultad);
  }

  public listarSedeFacultad():Observable<ISedeFacultad[]>{
    return this.http.get<ISedeFacultad[]>(this.urlServicio+'/listarSedeFacultad');
  }

  public eliminarSedeFacultad(Isedefacultad : number):Observable<ISedeFacultad>{
    return this.http.delete(this.urlServicio+'/eliminarSedeFaculta/'+Isedefacultad);
  }


  public eliminarSedeFacultadPorFacultad(Idfacultad : number):Observable<ISedeFacultad>{
    return this.http.delete(this.urlServicio+'/eliminarPorFacultad/'+Idfacultad);
  }
}
