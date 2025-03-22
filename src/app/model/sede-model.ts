export interface Isede{
    idSede?:number;
    nombreSede?:string;
    ubicacion?:string;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date; 
}

export class Sede implements Isede{
    idSede?:number;
    nombreSede?:string;
    ubicacion?:string;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date; 
}