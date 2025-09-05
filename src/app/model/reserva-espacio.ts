import { EspacioAcademico } from "./espacio-academico";
import { GrupoRelacion } from "./grupo-relacion";
import { Usuario } from "./usuario-model";

export interface IReservaEspacio{
    idReservaEspacio ?: number;
    ocupado ?: boolean;
    fechaReservaEspacio ?: Date;
    horario ?: string;
    grupoRelacion?:GrupoRelacion
    usuario ?: Usuario;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
}

export class ReservaEspacio implements IReservaEspacio{
    idReservaEspacio ?: number;
    ocupado ?: boolean;
    fechaReservaEspacio ?: Date;
    horario ?: string;
    grupoRelacion?:GrupoRelacion
    usuario ?: Usuario;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
}