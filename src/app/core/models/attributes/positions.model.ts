export interface IPositionsPlayers {
    statusCode:    number;
    isSuccess:     boolean;
    errorMessages: null;
    result:        ResultPositions[];
}

export interface ResultPositions {
    id:       number;
    tipo:     number;
    posicion: string;
}
