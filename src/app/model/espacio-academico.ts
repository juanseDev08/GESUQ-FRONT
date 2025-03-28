export interface IEspacioAcademico{
    idEspacioAcademico?:number;
    nombre?:string;
    descripcion?:string;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
}


export class EspacioAcademico implements IEspacioAcademico{
    idEspacioAcademico?:number;
    nombre?:string;
    descripcion?:string;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
}
