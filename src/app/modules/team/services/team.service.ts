import { Injectable } from '@angular/core';
import { IEquipos } from '../models/equipos.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../../enviroment';
import { HttpClient } from '@angular/common/http';

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
}
