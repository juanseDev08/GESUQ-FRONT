import { EspacioAcademico } from "./espacio-academico";
import { Facultad } from "./facultad-model";
import { IGrupo } from "./grupo-model";
import { Sede } from "./sede-model";


export interface IGrupoRelacion{
    idGrupoRelacion ?: number;
    grupo?:IGrupo;
    facultad?:Facultad;
    sede?:Sede;
    espacioAcademico?:EspacioAcademico;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
}

export class GrupoRelacion implements IGrupoRelacion{
    idGrupoRelacion ?: number;
    grupo?:IGrupo;
    facultad?:Facultad;
    sede?:Sede;
    espacioAcademico?:EspacioAcademico;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;


}