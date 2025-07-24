import { EspacioAcademico } from "./espacio-academico";
import { IEspacioPrograma } from "./espacio-programa";
import { Facultad } from "./facultad-model";
import { IGrupo } from "./grupo-model";
import { Sede } from "./sede-model";


export interface IGrupoRelacion{
    idGrupoRelacion ?: number;
    /* grupo?:IGrupo; */
    facultad?:Facultad;
    sede?:Sede;
    espacioPrograma?:IEspacioPrograma;
    /* espacioAcademico?:EspacioAcademico; */
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
}

export class GrupoRelacion implements IGrupoRelacion{
    idGrupoRelacion ?: number;
    /* grupo?:IGrupo; */
    facultad?:Facultad;
    sede?:Sede;
    espacioPrograma?:IEspacioPrograma;
    /* espacioAcademico?:EspacioAcademico; */
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;


}