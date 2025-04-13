import { ISemestre } from "./semestre";

export interface IGrupo{
    idGrupo?:number;
    nombreGrupo?:string;
    semestre?:ISemestre;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date; 
}

export class Grupo implements IGrupo{
    idGrupo?:number;
    nombreGrupo?:string;
    semestre?:ISemestre;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date; 
}