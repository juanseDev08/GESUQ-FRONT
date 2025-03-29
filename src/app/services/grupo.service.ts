import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGrupo } from '../model/grupo-model';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

 urlServicio = environment.urlbackend + '/api/grupo';
     constructor(private http: HttpClient) { }
     public listarGrupos(): Observable<IGrupo[]> {
         return this.http.get<IGrupo[]>(this.urlServicio + '/listarGrupos');
 
     }
 
     public crearGrupo(Igrupo:IGrupo):Observable<IGrupo>{
         return this.http.post(this.urlServicio+'/crearGrupo',Igrupo);
     }
 
     public actualizarGrupo(Igrupo:IGrupo):Observable<IGrupo>{
         return this.http.put(this.urlServicio+'/actualizarGrupo',Igrupo)
     }
 
     public eliminarGrupo(Igrupo:number):Observable<IGrupo>{
         return this.http.delete(this.urlServicio+'/eliminarGrupo/'+Igrupo);
     }
}
