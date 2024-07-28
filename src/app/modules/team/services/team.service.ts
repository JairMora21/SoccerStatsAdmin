import { Injectable } from '@angular/core';
import { IEquipo, IEquipos } from '../models/equipos.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../../enviroment';
import { HttpClient } from '@angular/common/http';
import { IJugadores } from '../models/players.model';
import { ICreatePlayer } from '../../../core/models/players/create-player.model';
import { IUpdatePlayer } from '../../../core/models/players/update-player.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private apiUrl = environment.apiUrl;

  constructor(
    private _http: HttpClient
  ) { }

  getAllTeams(): Observable<IEquipos> {
    let url = `${this.apiUrl}/Equipo/Equipos`;
    return this._http.get<IEquipos>(url);
  }

  getTeamById(id: number): Observable<IEquipo> {
    const url = `${this.apiUrl}/Equipo/Equipo/${id}`;
    return this._http.get<IEquipo>(url);
  }

  getAllPlayers(idEquipo: number): Observable<IJugadores> {
    const url = `${this.apiUrl}/Equipo/Jugadores/${idEquipo}`;
    return this._http.get<IJugadores>(url);
  }

  deletePlayer(id: number): Observable<any> {
    const url = `${this.apiUrl}/Equipo/DeleteJugador/${id}`;
    return this._http.delete(url);
  }

  createPlayer(player: ICreatePlayer): Observable<any> {
    const url = `${this.apiUrl}/Equipo/AddJugador`;
    return this._http.post(url, player);
  }

  updatePlayer(id: number,player: IUpdatePlayer): Observable<any> {
    const url = `${this.apiUrl}/Equipo/UpdateJugador/${id}`;
    return this._http.put(url, player);
  }


}
