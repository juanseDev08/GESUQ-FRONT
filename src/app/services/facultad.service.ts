import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFacultad } from '../model/facultad-model';

@Injectable({
  providedIn: 'root'
})
export class FacultadService {


  urlServicio = environment.urlbackend + '/api/facultad';

  constructor(private hhtp: HttpClient) { }


  public listarFacultades(): Observable<IFacultad[]>{
    return this.hhtp.get<IFacultad[]>(this.urlServicio+'/listarFacultad');
  }

  public crearFacultad(Ifacultad : IFacultad): Observable<IFacultad>{
    return this.hhtp.post(this.urlServicio+'/crearFacultad', Ifacultad);
  }

  public actualizarFacultad(Ifacultad : IFacultad): Observable<IFacultad>{
    return this.hhtp.put(this.urlServicio+'/actualizarFacultad',Ifacultad);
  }

  public eliminarFacultad(Ifacultad: number): Observable<IFacultad>{
    return this.hhtp.delete(this.urlServicio+'/eliminarFacultad/'+Ifacultad);
  }

  public crearFacultadesMasivo(facultades: any[]): Observable<IFacultad[]>{
    return this.hhtp.post<IFacultad[]>(this.urlServicio+'/crearFacultadesMasivo', facultades);
  }
}
