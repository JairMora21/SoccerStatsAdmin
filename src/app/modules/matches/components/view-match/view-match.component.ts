import { Component, Inject } from '@angular/core';
import { MatchService } from '../../services/match.service';
import { Goleadores, IPartidoStats, Participante, ResultStats, Tarjeta } from '../../../../core/models/matches/view-match.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { LOCAL_STORAGE } from '../../../../shared/Constants/local-storage';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-view-match',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-match.component.html',
  styleUrl: './view-match.component.css'
})
export class ViewMatchComponent {

  partidoStats: ResultStats = {} as ResultStats;
  fechaFormat: string = '';
  urlEscudo: string | null = localStorage.getItem(LOCAL_STORAGE.TeamId);

  constructor(
    public dialogRef: MatDialogRef<ViewMatchComponent>,
    private _matchService: MatchService,
    @Inject(MAT_DIALOG_DATA) public data: { idMatch: number },

  ) { }



  async ngOnInit(): Promise<void> {
    console.log(this.data.idMatch);
    await this.obtenerPartidoStats(this.data.idMatch);  
  }

  async obtenerPartidoStats(idPartido: number): Promise<void> {
    try {
      const data: IPartidoStats = await firstValueFrom(this._matchService.showMatch(idPartido));
  
      if (data.isSuccess === false) {
        console.error(data.errorMessages);
      } else {
        this.partidoStats = data.result;
        const fechaCompleta = new Date(this.partidoStats.datosPartido.fecha);
        const mes = fechaCompleta.getMonth() + 1;
        const dia = fechaCompleta.getDate() + 1;
        const fechaFormateada = `${mes}/${dia}`;
        this.fechaFormat = fechaFormateada;
        console.log(this.partidoStats);
      }
    } catch (error) {
      console.error('Error al obtener el equipo', error);
    }
  }

  getPlayersWithGoals(): Goleadores[] {

    if (this.partidoStats.goleadores)
      return this.partidoStats.goleadores;
    else
      return [];

  }

  getPlayersWithRedCards(): Tarjeta[] {
    if (this.partidoStats.tarjetas)
      return this.partidoStats.tarjetas.filter(tarjeta => tarjeta.idTipoTarjeta == 1);
    else
      return [];
  }

  getPlayersWithYellowCards(): Tarjeta[] {
    if (this.partidoStats.tarjetas)
      return this.partidoStats.tarjetas.filter(tarjeta => tarjeta.idTipoTarjeta == 2);
    else
      return [];
  }

  getParticipants(): Participante[] {
    if (this.partidoStats.participantes)
      return this.partidoStats.participantes;
    else
      return [];
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
