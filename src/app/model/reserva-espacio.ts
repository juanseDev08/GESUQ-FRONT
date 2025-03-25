import { EspacioAcademico } from "./espacio-academico";
import { Usuario } from "./usuario-model";

export interface IReservaEspacio{
    idReservaEspacio ?: number;
    ocupado ?: boolean;
    fechaReservaEspacio ?: Date;
    horario ?: string;
    espacioAcademico ?: EspacioAcademico;
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
    espacioAcademico ?: EspacioAcademico;
    usuario ?: Usuario;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
}