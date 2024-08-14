export interface ICreateMatch {
  Result: Result;
  PlayerStats: PlayerStats[];
}


export interface Result {
  NombreRival: string;
  GolesFavor: number;
  GolesContra: number;
  Fecha: string;
  IdResultado: number;
  IdTipoPartido: number;
  IdTemporada: number;
  IdEquipo: number;
}

export interface PlayerStats {
  Id: number;
  Nombre: string;
  Dorsal: string;
  Goles: number;
  Amarillas: number;
  Rojas: number;
}
