import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMatches } from '../../../core/models/matches/matches.model';
import { APIResponse } from '../../../core/models/api-response.model';
import { environment } from '../../../../../enviroment';
import { HttpClient } from '@angular/common/http';
import { ICreateMatch } from '../../../core/models/matches/create-match .model';
import { IUpdateMatch } from '../../../core/models/matches/update-match.model';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  private apiUrl = environment.apiUrl;

  constructor( private _http: HttpClient  ) { }

  showMatches(idTeam: number): Observable<IMatches> {
    const url = `${this.apiUrl}/Partido/Partidos/${idTeam}`;
    return this._http.get<IMatches>(url);
  }

  createMatch(match: ICreateMatch): Observable<APIResponse> {
    const url = `${this.apiUrl}/Partido/AddPartido`;
    return this._http.post<APIResponse>(url, match);
  }

  editMatch(match: IUpdateMatch, matchId: number): Observable<APIResponse> {
    const url = `${this.apiUrl}/Partido/UpdatePartido/${matchId}`;
    return this._http.put<APIResponse>(url, match);
  }

  deleteMatch(matchId: number): Observable<APIResponse> {
    const url = `${this.apiUrl}/Partido/DeletePartido/${matchId}`;
    return this._http.delete<APIResponse>(url);
  }
}
