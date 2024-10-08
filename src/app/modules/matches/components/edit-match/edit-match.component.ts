import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { CardsComponent } from '../create-match/steps/cards/cards.component';
import { GoalsComponent } from '../create-match/steps/goals/goals.component';
import { PlayersComponent } from '../create-match/steps/players/players.component';
import { ResultComponent } from '../create-match/steps/result/result.component';
import { SummaryMatchComponent } from '../create-match/steps/summary-match/summary-match.component';
import { ITypeMatch, ResultTypeMatch } from '../../../../core/models/attributes/type-match.model';
import { PlayerStats } from '../../../../core/models/matches/create-match .model';
import { ResultEquipo } from '../../../team/models/equipos.model';
import { IJugadores, ResultPlayers } from '../../../team/models/players.model';
import { firstValueFrom } from 'rxjs';
import { IPartidoStats, ResultStats } from '../../../../core/models/matches/view-match.interface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatchService } from '../../services/match.service';
import { AttributesService } from '../../../../shared/services/attributes.service';
import { LOCAL_STORAGE } from '../../../../shared/Constants/local-storage';
import { TeamService } from '../../../team/services/team.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';

@Component({
  selector: 'app-edit-match',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, ResultComponent, PlayersComponent, GoalsComponent, CardsComponent, SummaryMatchComponent, MatDatepickerModule, MatStepperModule, MatIcon
    , MatSelectModule, MatRadioModule, MatButtonModule, MatButtonToggleModule, FormsModule],
  templateUrl: './edit-match.component.html',
  styleUrl: './edit-match.component.css'
})
export class EditMatchComponent {
  dataLoaded = false;

  currentViewIndex: number = 1;
  form: FormGroup = new FormGroup({});
  number: string = '0';
  players: ResultPlayers[] = [];
  typesOfMatches: ResultTypeMatch[] = [];
  formTouched = false;

  formulario: string[] = ['', 'Datos del partido', 'Asistencia ', 'Goleadores', 'Tarjetas', 'Resumen'];


  // asistencia a los partidos de los jugadores
  selectedParticipatePlayersId: number[] = [];
  selectedParticipatePlayers: PlayerStats[] = [];
  defaultGoals: PlayerStats[] = [
    { Id: 0, Nombre: 'Autogol', Dorsal: '', Goles: 0, Amarillas: 0, Rojas: 0 },
    { Id: 0, Nombre: 'Invitado', Dorsal: '', Goles: 0, Amarillas: 0, Rojas: 0 }

  ];

  fechaFormat: string = '';


  isMoreThanTotalGoals: boolean = false;
  isSpecialOptions: boolean = false;
  hideSingleSelectionIndicator = signal(false);

  card: string = 'yellow';
  teamId: number = Number(this.localStorageService.getTeamId());
  equipo: ResultEquipo = {
    id: this.teamId,
    nombre: this.localStorageService.getTeamName(),
    lugar: '',
    escudo: this.localStorageService.getTeamBadge(),
  };
  partidoStats: ResultStats = {} as ResultStats;


  constructor(
    public dialogRef: MatDialogRef<EditMatchComponent>,
    private _matchService: MatchService,
    private _attributesService: AttributesService,
    private _teamService: TeamService,
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,

    @Inject(MAT_DIALOG_DATA) public data: { idMatch: number, seasonId: number },


  ) { }

  async ngOnInit(): Promise<void> {

    this.getPlayers();
    this.getTypesOfMatches();
    await this.obtenerPartidoStats(this.data.idMatch);
    this.selectedParticipatePlayers = this.transformPlayerStats(this.partidoStats);
    this.selectedParticipatePlayersId = this.selectedParticipatePlayers.map((player) => player.Id);

    if (this.partidoStats && this.partidoStats.datosPartido) {
      this.initForm();
      this.dataLoaded = true;
    } else {
      console.error('Datos de partido no disponibles');
    }
  }

  transformPlayerStats(players: ResultStats): PlayerStats[] {
    if (players && players.participantes) {
      return players.participantes.map((player) => {
        return {
          Id: player.id,
          Nombre: player.nombre,
          Dorsal: player.dorsal,
          Goles: players.goleadores.find((goleador) => goleador.id === player.id)?.cantidad || 0,
          Amarillas: players.tarjetas.find((amarilla) => amarilla.id === player.id && amarilla.tarjeta === 'Amarilla')?.cantidad || 0,
          Rojas: players.tarjetas.find((roja) => roja.id === player.id && roja.tarjeta === 'Roja')?.cantidad || 0,
        };
      });
    }
    return [];
  }

  getPlayersWithGoals(): PlayerStats[] {
    const defaultPlayers = this.defaultGoals.filter(player => player.Goles > 0);
    const players = this.selectedParticipatePlayers.filter(player => player.Goles > 0)

    return [...defaultPlayers, ...players].sort((a, b) => b.Goles - a.Goles);
  }

  isAnyPlayerCautioned(): boolean {
    return this.selectedParticipatePlayers.some(player => player.Amarillas > 0 || player.Rojas > 0);
  }
  getPlayersWithYellowCards(): PlayerStats[] {
    return this.selectedParticipatePlayers.filter(player => player.Amarillas > 0);
  }

  getPlayersWithRedCards(): PlayerStats[] {
    return this.selectedParticipatePlayers.filter(player => player.Rojas > 0);
  }
  get result() {
    return this.form.get('result') as FormGroup;
  }
  get playerStats(): FormArray {
    return this.form.get('playerStats') as FormArray;
  }
  initForm() {
    this.form = new FormGroup({
      result: new FormGroup({
        GolesFavor: new FormControl(this.partidoStats.datosPartido.golesFavor, [Validators.required, Validators.min(0)]),
        GolesContra: new FormControl(this.partidoStats.datosPartido.golesContra, [Validators.required, Validators.min(0)]),
        NombreRival: new FormControl(this.partidoStats.datosPartido.nombreRival, [Validators.required]),
        IdTipoPartido: new FormControl(this.getIdGameResult(this.partidoStats.datosPartido.tipoPartido), [Validators.required]),
        Fecha: new FormControl(this.partidoStats.datosPartido.fecha, [Validators.required]),
        IdResultado: new FormControl(this.partidoStats.datosPartido.resultado, [Validators.required]),
        IdTemporada: new FormControl(this.data.seasonId, [Validators.required]),
        IdEquipo: new FormControl(this.teamId, [Validators.required]),
      }),
      playerStats: new FormArray([]),
    });

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
      }
    } catch (error) {
      console.error('Error al obtener el equipo', error);
    }
  }

  getPlayers() {
    this._teamService.getAllPlayers(this.teamId).subscribe({
      next: (data: IJugadores) => {
        if (data.isSuccess == false) {
          console.error('Error al obtener jugadores', data.errorMessages);
        } else {
          this.players = data.result;
        }
      },
      error: (error) => {
        console.error('Error al obtener jugadores', error);
      },
    });

  }

  changeSpecialOptions() {
    this.isSpecialOptions = !this.isSpecialOptions;
  }

  onCardChange(value: string) {
    this.card = value;
  }
  getTypesOfMatches() {
    this._attributesService.getTypeMatches().subscribe({
      next: (data: ITypeMatch) => {
        if (data.isSuccess == false) {
          console.error('Error al obtener tipos de partidos', data.errorMessages);
        } else {
          this.typesOfMatches = data.result;
        }
      },
      error: (error) => {
        console.error('Error al obtener tipos de partidos', error);
      },
    });
  }

  navigate(direction: number) {
    if (direction == 1) {
      if (this.form.get('result')?.invalid) {
        this.form.markAllAsTouched();
        this.formTouched = true;
        return;
      }
    }


    const newIndex = this.currentViewIndex + direction;
    this.formTouched = false;

    if (newIndex >= 1 && newIndex <= 5) {
      this.currentViewIndex = newIndex;
    }
  }

  onSubmit() {
    if (this.form.valid) {

      const defaultPlayers = this.defaultGoals.filter(player => player.Goles > 0);
      this.selectedParticipatePlayers = [...defaultPlayers, ...this.selectedParticipatePlayers];
      this.selectedParticipatePlayers.forEach(player => {
        this.playerStats.push(this.fb.group(player));
      });


      const goalsAgainst = this.form.get('result.GolesContra')?.value;
      const goalsFor = this.form.get('result.GolesFavor')?.value;
      const resultId = this.getResultId(goalsAgainst, goalsFor);
      this.form.get('result.IdResultado')?.setValue(resultId);

      

      this._matchService.editMatch(this.form.value, this.data.idMatch).subscribe({
        next: (data: any) => {
          if (data.isSuccess == false) {
            console.error('Error al crear partido', data.errorMessages);
          } else {
            this.closeDialog();
          }
        },
        error: (error) => {
          console.error('Error al crear partido', error);
        },
      });

    }
  }

  addCard(player: PlayerStats, cardType: string) {
    if (cardType == 'yellow') {
      player.Amarillas += 1;
    } else {
      player.Rojas += 1;
    }
  }

  removeCard(player: PlayerStats, cardType: string) {
    if (cardType == 'yellow') {
      if (player.Amarillas > 0) {
        player.Amarillas -= 1;
      }
    } else {
      if (player.Rojas > 0) {
        player.Rojas -= 1;
      }
    }
  }

  addGoal(player: PlayerStats) {
    const totalGoalsPlayers = this.selectedParticipatePlayers.reduce((acc, player) => acc + player.Goles, 0);
    const totalGoalsDefault = this.defaultGoals.reduce((acc, player) => acc + player.Goles, 0);
    const totalGoals = totalGoalsPlayers + totalGoalsDefault;
    const goalsInMatch = this.form.get('result.GolesFavor')?.value;
    if (totalGoals >= goalsInMatch) {
      this.isMoreThanTotalGoals = true
      return;
    }
    this.isMoreThanTotalGoals = false;
    player.Goles += 1;
  }

  removeGoal(player: PlayerStats) {
    this.isMoreThanTotalGoals = false;
    if (player.Goles > 0) {
      player.Goles -= 1;
    }
  }

  getIdGameResult(card: string): number {
    switch (card) {
      case 'Jornada': return 1;
      case 'Eliminatoria': return 2;
      case 'Amistoso': return 3;
      default: return 0;
    }
  }

  getResultId(goalsAgainst: number, goalsFor: number): number {
    if (goalsAgainst > goalsFor) {
      return 3;
    }
    if (goalsAgainst === goalsFor) {
      return 2;
    }

    return 1;
  }

  onPlayerSelectionChange(event: MatSelectChange) {
    const selectedValue = event.value;
    const previouslySelected = this.selectedParticipatePlayersId;

    if(selectedValue.length > previouslySelected.length){
      const newPlayer = selectedValue.filter((id: number) => !previouslySelected.includes(id));
      const player = this.players.find((player) => player.id === newPlayer[0]);
      if (player) {
        this.selectedParticipatePlayers.push({
          Id: player.id,
          Nombre: player.nombre,
          Dorsal: player.dorsal,
          Goles: 0,
          Amarillas: 0,
          Rojas: 0
        });
      }
    }
    else{
      const removedPlayer = previouslySelected.filter((id: number) => !selectedValue.includes(id));
      const playerIndex = this.selectedParticipatePlayers.findIndex((player) => player.Id === removedPlayer[0]);
      this.selectedParticipatePlayers.splice(playerIndex, 1);
    }
    this.selectedParticipatePlayersId = selectedValue;
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
