export interface IEspacioAcademico{
    idEspacioAcademico?:number;
    nombre?:string;
    semestre?:number;
    descripcion?:string;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
}


export class EspacioAcademico implements IEspacioAcademico{
    idEspacioAcademico?:number;
    nombre?:string;
    semestre?:number;
    descripcion?:string;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
}
