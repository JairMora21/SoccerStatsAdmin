export interface IJugadores {
    statusCode: number;
    isSuccess: boolean;
    errorMessages: null;
    result: ResultPlayers[];
  }
  
  
  export interface ResultPlayers {
    id:       number;
    idPosicion: number;
    posicion: string;
    equipo:   string;
    nombre:   string;
    apellido: string;
    img:      null;
    dorsal:   string;
    activo:   boolean;
  }
  


  