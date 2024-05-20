export interface IEquipos {
    statusCode:    number;
    isSuccess:     boolean;
    errorMessages: null | Errores;
    result:        ResultEquipo[];
  }
  
  export interface IEquipo {
    statusCode:    number;
    isSuccess:     boolean;
    errorMessages: null;
    result:        ResultEquipo;
  }
  
  export interface ResultEquipo {
    id:     number;
    nombre: string;
    lugar:  string;
    escudo: string;
  }

  export interface Errores {
    statusCode:    number;
    errorMessages: any;
  }
  
  