  
  export interface IPartidoStats {
    statusCode:    number;
    isSuccess:     boolean;
    errorMessages: null;
    result:        ResultStats;
  }
  
  export interface ResultStats {
    datosPartido:  DatosPartido;
    goleadores:    Goleadores[];
    participantes: Participante[];
    tarjetas:      Tarjeta[];
  }
  
  export interface DatosPartido {
    id:          number;
    equipo:      string;
    equipoEscudo: string;
    temporada:   string;
    tipoPartido: string;
    resultado:   string;
    fecha:       Date;
    nombreRival: string;
    golesFavor:  number;
    golesContra: number;
  }
  
  export interface Goleadores {
    id:       number;
    nombre:   string;
    cantidad: number;
  }
  
  export interface Participante {
    id:     number;
    nombre: string;
    dorsal: string;
  
  }
  
  export interface Tarjeta {
    id:            number;
    nombre:        string;
    tarjeta:       string;
    idTipoTarjeta: number;
    cantidad:      number;
  }
  
  