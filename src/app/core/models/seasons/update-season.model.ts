export interface ITemporadsUpdate {
    idClasificacion?: number;
    idEquipo: number; // Asigno como obligatorio basado en la anotación [Required]
    noTemporada: number; // Obligatorio también
    fechaInicio: Date; // DateOnly se traduce como Date en TypeScript y es obligatorio
    fechaFinal?: Date; // Opcional, DateOnly? se traduce como Date opcional
    posicion?: string;
    nombreTemporada?: string;
}
