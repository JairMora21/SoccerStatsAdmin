export interface ICreateMatch {
  result: Result;
  playerStats: PlayerStats[];
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
  id: number;
  nombre: string;
  dorsal: string;
  goles: number;
  amarillas: number;
  rojas: number;
}
