export interface ITypeMatch {
    statusCode:    number;
    isSuccess:     boolean;
    errorMessages: null;
    result:        ResultTypeMatch[];
}

export interface ResultTypeMatch {
    id:           number;
    tipoPartido1: string;
}
