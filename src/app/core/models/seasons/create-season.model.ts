export interface ITemporadaCreate {
    idEquipo?: number; // El campo es opcional en TypeScript, no puede ser 'required' directamente aquí
    noTemporada?: number; // Similar al anterior
    fechaInicio?: Date; // DateOnly se traduce como Date en TypeScript
    nombreTemporada?: string;
}
