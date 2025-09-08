import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { IPrograma } from '../model/programa-model';

@Injectable({
  providedIn: 'root'
})
export class ProgramaService {

  urlServicio = environment.urlbackend + '/api/programa';
  constructor(private http : HttpClient) {}


  public listarProgramas(): Observable<IPrograma[]>{
    return this.http.get<IPrograma[]>(this.urlServicio+'/listarProgramas');
  }

  public crearPrograma(Iprograma: IPrograma): Observable<IPrograma>{
    return this.http.post(this.urlServicio+'/crearPrograma', Iprograma);
  }

  public actualizarPrograma(Iprograma: IPrograma): Observable<IPrograma>{
    return this.http.put(this.urlServicio+'/actualizaPrograma', Iprograma);
  }

  public eliminarPrograma(Iprograma: number): Observable<IPrograma>{
    return this.http.delete(this.urlServicio+'/eliminarPrograma/'+Iprograma);
  }

  public crearProgramasMasivo(programas: any[]): Observable<IPrograma[]>{
    return this.http.post<IPrograma[]>(this.urlServicio+'/crearProgramasMasivo', programas);
  }
}
