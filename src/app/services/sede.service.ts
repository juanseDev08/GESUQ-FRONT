import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Isede } from "../model/sede-model";
import { environment } from "../../environments/environment.development";
import { HttpClient } from "@angular/common/http";



@Injectable({
    providedIn: 'root'
})
export class SedeService {

    urlServicio = environment.urlbackend + '/api/sede';
    constructor(private http: HttpClient) { }
    public listarSedes(): Observable<Isede[]> {
        return this.http.get<Isede[]>(this.urlServicio + '/listarSedes');

    }

    public crearSede(Isede:Isede):Observable<Isede>{
        return this.http.post(this.urlServicio+'/crearSede',Isede);
    }

    public actualizarSede(Isede:Isede):Observable<Isede>{
        return this.http.put(this.urlServicio+'/actualizarSede',Isede)
    }

    public eliminarSede(Isede:number):Observable<Isede>{
        return this.http.delete(this.urlServicio+'/eliminarSede/'+Isede);
    }

    public crearSedesMasivo(sedes: Isede[]): Observable<Isede[]> {
        return this.http.post<Isede[]>(this.urlServicio + '/crearSedesMasivo', sedes);
    }
}