import { IFacultad } from "./facultad-model";
import { IPrograma } from "./programa-model";

export interface IFacultadPrograma{
    idFacultadPrograma ?: number;
    facultad?: IFacultad;
    programa?: IPrograma;
    // idFacultad?:number;
    // nombreFacultad?:string;
    // codPrograma?:string;
    // nombrePrograma?:string;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
}

export class FacultadPrograma implements IFacultadPrograma{
    idFacultadPrograma ?: number;
    facultad?: IFacultad;
    programa?: IPrograma;
    // idFacultad?:number;
    // nombreFacultad?:string;
    // codPrograma?:string;
    // nombrePrograma?:string;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
}