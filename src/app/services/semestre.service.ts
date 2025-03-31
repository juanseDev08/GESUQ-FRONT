import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ISemestre } from '../model/semestre';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SemestreService {
  urlSevice = environment.urlbackend + '/api/semestre'
  constructor(private http : HttpClient) { }

  public crearSemestre (Isemestre : ISemestre):Observable <ISemestre>{
    return this.http.post(this.urlSevice+'/crearSemetre', Isemestre);
  }

  public listarSemestre ():Observable<ISemestre[]>{
    return this.http.get<ISemestre[]>(this.urlSevice+'/listarSemestre');
  }

  public actualizarSemestre(Isemestre : ISemestre):Observable <ISemestre>{
    return this.http.put(this.urlSevice+'/actalizarSemestre', Isemestre);
  }

  public eliminarSemestre(Isemestre : number):Observable <ISemestre>{
    return this.http.delete(this.urlSevice+'/eliminarSemestre/'+Isemestre);
  }
}
