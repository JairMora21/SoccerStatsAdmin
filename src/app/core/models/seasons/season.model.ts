export interface ResultTemporadas {
    statusCode:    number;
    isSuccess:     boolean;
    errorMessages: null;
    result:        ITemporada[];
}

export interface ResultTemporada {
    statusCode:    number;
    isSuccess:     boolean;
    errorMessages: null;
    result:        ITemporada;
}

export interface ITemporada {
    id:              number;
    clasificacion:   any;
    equipo:          string;
    noTemporada:     number;
    fechaInicio:     Date;
    fechaFinal:      Date;
    posicion:        any;
    nombreTemporada: string;
    idClasificacion: number;
}
