import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../enviroment';
import { Observable } from 'rxjs';
import { ResultTemporadas } from '../../../core/models/seasons/season.model';
import { ITemporadaCreate } from '../../../core/models/seasons/create-season.model';
import { ITemporadsUpdate } from '../../../core/models/seasons/update-season.model';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {

  private apiUrl = environment.apiUrl;

  constructor(    private _http: HttpClient  ) { }


  getSeasons(idTeam: number): Observable<ResultTemporadas> {
    let url = `${this.apiUrl}/Temporada/Temporadas/${idTeam}`;
    return this._http.get<ResultTemporadas>(url);
  }

  createSeason(season: ITemporadaCreate): Observable<any> {
    let url = `${this.apiUrl}/Temporada/AddTemporada`;
    return this._http.post(url, season);
  }

  updateSeason(idSeason: number, season: ITemporadsUpdate) {
    let url = `${this.apiUrl}/Temporada/UpdateTemporada/${idSeason}`;
    return this._http.put(url, season);

  }

  deleteSeason(idSeason: number) {
    let url = `${this.apiUrl}/Temporada/DeleteTemporada/${idSeason}`;
    return this._http.delete(url);
  }
}
