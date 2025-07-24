import { IEspacioAcademico } from './espacio-academico';
import { IPrograma } from './programa-model';

export interface IEspacioPrograma {
  idEspacioPrograma?: number;
  espacioAcademico?: IEspacioAcademico;
  programa?: IPrograma;
  idUsuarioCreacion?: string;
  idUsuarioModificacion?: string;
  fechaModificacion?: Date;
}

export class EspacioPrograma implements IEspacioPrograma {
  idEspacioPrograma?: number;
  espacioAcademico?: IEspacioAcademico;
  programa?: IPrograma;
  idUsuarioCreacion?: string;
  idUsuarioModificacion?: string;
  fechaModificacion?: Date;
}
