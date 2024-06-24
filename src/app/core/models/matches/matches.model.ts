export interface IMatches {
    statusCode:    number;
    isSuccess:     boolean;
    errorMessages: null;
    result:        IResultMatch[];
}

export interface IResultMatch {
    id:           number;
    equipo:       string;
    equipoEscudo: string;
    temporada:    string;
    tipoPartido:  string;
    resultado:    string;
    fecha:        Date;
    nombreRival:  string;
    golesFavor:   number;
    golesContra:  number;
}

