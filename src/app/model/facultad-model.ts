export interface IFacultad{
    idFacultad?:number;
    nombreFacultad?:string;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date; 
}

export class Facultad implements IFacultad{
    idFacultad?:number;
    nombreFacultad?:string;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
}