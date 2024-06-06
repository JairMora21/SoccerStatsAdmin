export interface IClasification {
    statusCode:    number;
    isSuccess:     boolean;
    errorMessages: null;
    result:        ResultClasification[];
}

export interface ResultClasification {
    id:            number;
    clasificacion: string;
}
