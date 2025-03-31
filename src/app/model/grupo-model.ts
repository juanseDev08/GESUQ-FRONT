export interface IGrupo{
    idGrupo?:number;
    nombreGrupo?:string;
    semestre?:string;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date; 
}

export class Grupo implements IGrupo{
    idGrupo?:number;
    nombreGrupo?:string;
    semestre?:string;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date; 
}