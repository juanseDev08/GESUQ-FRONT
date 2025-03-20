
export interface IUsuario {
    idUsuario?: number;
    noDocumento ?: string;
    nombres?: string;
    apellidos?: string;
    usuario?: string;
    clave?: string;
    activo?: boolean;
    nomActivo?: string;
    admin?: boolean;
    nombreRol ?: string;
    tokenRecuperacion?: string;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
    isAdmin?: boolean;
  }
  
  export class Usuario implements IUsuario {
    idUsuario?: number;
    noDocumento ?: string;
    nombres?: string;
    apellidos?: string;
    usuario?: string;
    clave?: string;
    activo?: boolean;
    nomActivo?: string;
    admin?: boolean;
    nombreRol ?: string;
    tokenRecuperacion?: string;
    idUsuarioCreacion?: string;
    idUsuarioModificacion?: string;
    fechaModificacion?: Date;
    isAdmin?: boolean;
  }