import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroment';
import { HttpClient } from '@angular/common/http';
import { ICards } from '../../core/models/attributes/cards.model';
import { IPositionsPlayers } from '../../core/models/attributes/positions.model';
import { ITypeMatch } from '../../core/models/attributes/type-match.model';
import { IClasification } from '../../core/models/attributes/clasification.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttributesService {

  private apiUrl = environment.apiUrl;

  constructor(
    private _http: HttpClient
  ) { }


  getCards(): Observable<ICards> {
    const url = `${this.apiUrl}/Atributo/Tarjetas`;
    return this._http.get<ICards>(url);
  }

  getPositions(): Observable<IPositionsPlayers> {
    const url = `${this.apiUrl}/Atributo/Posiciones`;
    return this._http.get<IPositionsPlayers>(url);
  }

  getTypeMatches(): Observable<ITypeMatch> {
    const url = `${this.apiUrl}/Atributo/Partidos`;
    return this._http.get<ITypeMatch>(url);
  }

  getClassifications(): Observable<IClasification>{
    const url = `${this.apiUrl}/Atributo/Clasificacion`;
    return this._http.get<IClasification>(url);
  }
}
