export interface ICreatePlayer {
    IdPosicion: number;
    IdEquipo?: number;
    Nombre: string;
    Apellido: string;
    Img?: string;  // Opcional
    Dorsal: string;  // Opcional
    Activo: boolean;
}
