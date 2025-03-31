import {  IEspacioAcademico } from "./espacio-academico";
import { ISemestre } from "./semestre";

export interface IEspacioSemestre {
    IdEspacioSemestre ?: number;
    espacioAcademico ?: IEspacioAcademico;
    semestre ?: ISemestre;  
}

export class EspacioSemestre implements IEspacioSemestre {
    IdEspacioSemestre ?: number;
    espacioAcademico ?: IEspacioAcademico;
    semestre ?: ISemestre;
}