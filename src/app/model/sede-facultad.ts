import { IFacultad } from "./facultad-model";
import { Isede } from "./sede-model";

export interface ISedeFacultad{
    idsedefacultad ?: number;
    sede ?: Isede;
    facultad ?: IFacultad;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
}

export class SedeFacultad implements ISedeFacultad{
    idsedefacultad ?: number;
    sede ?: Isede;
    facultad ?: IFacultad;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
}