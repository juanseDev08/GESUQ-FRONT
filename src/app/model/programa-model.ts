export interface IPrograma{
    idPrograma ?: number;
    nombre?: string;
    codPrograma?: string;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
}

export class Programa implements IPrograma{
    idPrograma ?: number;
    nombre?: string;
    codPrograma?: string;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
}