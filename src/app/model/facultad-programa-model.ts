export interface IFacultadPrograma{
    idFacultadPrograma ?: number;
    idFacultad?:number;
    nombreFacultad?:string;
    codPrograma?:string;
    nombrePrograma?:string;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
}

export class FacultadPrograma implements IFacultadPrograma{
    idFacultadPrograma ?: number;
    idFacultad?:number;
    nombreFacultad?:string;
    codPrograma?:string;
    nombrePrograma?:string;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
}