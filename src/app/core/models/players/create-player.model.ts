export interface ICreatePlayer {
    idPosicion: number;
    idEquipo?: number;
    nombre: string;
    apellido: string;
    img?: string;  // Opcional
    dorsal: string;  // Opcional
    activo: boolean;
}
