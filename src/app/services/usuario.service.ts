import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUsuario } from '../model/usuario-model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

    urlServicio = environment.urlbackend + '/api/usuario';
  constructor(private http: HttpClient) { }

  public buscarUsuarioPorUserName(username : string): Observable<IUsuario>{
    return this.http.get(this.urlServicio + '/buscarPorUsuario/'+username)
  }
}
