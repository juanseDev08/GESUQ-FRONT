import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IEspacioAcademicoPrograma } from '../model/espacio-academico-programa';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspacioAcademicoProgramaService {

   urlServicio = environment.urlbackend+'/api/espacioPrograma';  
   constructor(private http : HttpClient) { }
 
   public crearEspacioPrograma(IespacioPrograma : IEspacioAcademicoPrograma): Observable<IEspacioAcademicoPrograma>{
     return this.http.post(this.urlServicio+'/crearEspacioPrograma',IespacioPrograma);
   }
 
   public listarEspacioPrograma():Observable<IEspacioAcademicoPrograma[]>{
     return this.http.get<IEspacioAcademicoPrograma[]>(this.urlServicio+'/listarEspacioPrograma');
   }
 
   public listarPorPrograma(idPrograma : number): Observable<IEspacioAcademicoPrograma>{
     return this.http.get(this.urlServicio+'/actualizarEspacioAcademico/'+idPrograma);
   }
 
   public eliminarEspacioPrograma(IespacioPrograma : number) :Observable<IEspacioAcademicoPrograma>{
     return this.http.delete(this.urlServicio+'/eliminarEspacioPrograma/'+IespacioPrograma);
   }
   public eliminarEspaProgramaporid(IespacioPrograma : number) :Observable<IEspacioAcademicoPrograma>{
     return this.http.delete(this.urlServicio+'/eliminarEspaProgramaporid/'+IespacioPrograma);
   }
}
