import { EspacioAcademico } from "./espacio-academico";
import { Usuario } from "./usuario-model";

export interface IReservaEspacio{
    idReservaEspacio ?: number;
    isOcupado ?: boolean;
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
    isOcupado ?: boolean;
    fechaReservaEspacio ?: Date;
    horario ?: string;
    espacioAcademico ?: EspacioAcademico;
    usuario ?: Usuario;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
}