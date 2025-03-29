export interface ISemestre{
    idSemestre ?:number;
    noSemestre ?:number;
    descripcion ?:string;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date; 
}   

export class Semestre implements ISemestre{
    idSemestre ?:number;
    noSemestre ?:number;
    descripcion ?:string;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date; 
}