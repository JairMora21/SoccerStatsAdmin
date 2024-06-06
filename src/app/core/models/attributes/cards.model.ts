export interface ICards {
    statusCode:    number;
    isSuccess:     boolean;
    errorMessages: null;
    result:        ResultCards[];
}

export interface ResultCards {
    id:      number;
    tarjeta: string;
}
