import { EspacioAcademico } from "./espacio-academico";
import { Programa } from "./programa-model";

export interface IEspacioAcademicoPrograma{
    idEspacioPrograma?:number;
    espacioAcademico?:EspacioAcademico;
    programa?:Programa;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
}

export class EspacioAcademicoPrograma implements IEspacioAcademicoPrograma{
    idEspacioPrograma?:number;
    espacioAcademico?:EspacioAcademico;
    programa?:Programa;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
}