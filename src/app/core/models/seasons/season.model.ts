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
    clasificacion:   null;
    equipo:          string;
    noTemporada:     number;
    fechaInicio:     Date;
    fechaFinal:      null;
    posicion:        null;
    nombreTemporada: string;
    idClasificacion: number;
}
