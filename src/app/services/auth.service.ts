import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  urlServicio = environment.urlbackend + '/api/v1/security';

  constructor(private http: HttpClient) {
  }

  public login(usuario:string,password:string): Observable<any>{
    let autRequest = {'username':usuario,'password':password,'rememberMe':false};
    return this.http.post(this.urlServicio + '/authenticate',autRequest);
  }
}
