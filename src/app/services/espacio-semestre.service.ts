import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEspacioSemestre } from '../model/espacio-semestre';

@Injectable({
  providedIn: 'root'
})
export class EspacioSemestreService {

  urlServicio = environment+'/api/espacioSemestre'

  constructor(private http : HttpClient) {}

  public crearEspacioSemestre (IespacioSemestre: IEspacioSemestre[]):Observable<any>{
      return this.http.post(this.urlServicio+'/crearEspacioSemestre',IespacioSemestre);
  }

  public listarEspacioSemestre():Observable<IEspacioSemestre[]>{
    return this.http.get<IEspacioSemestre[]>(this.urlServicio+'/listarEspacioSemestre')
  }
}
