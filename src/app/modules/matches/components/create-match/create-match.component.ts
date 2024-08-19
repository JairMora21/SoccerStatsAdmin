import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ResultComponent } from "./steps/result/result.component";
import { PlayersComponent } from "./steps/players/players.component";
import { GoalsComponent } from "./steps/goals/goals.component";
import { CardsComponent } from "./steps/cards/cards.component";
import { SummaryMatchComponent } from "./steps/summary-match/summary-match.component";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { LOCAL_STORAGE } from '../../../../shared/Constants/local-storage';
import { IJugadores, ResultPlayers } from '../../../team/models/players.model';
import { TeamService } from '../../../team/services/team.service';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { ResultEquipo } from '../../../team/models/equipos.model';
import { AttributesService } from '../../../../shared/services/attributes.service';
import { ITypeMatch, ResultTypeMatch } from '../../../../core/models/attributes/type-match.model';
import { PlayerStats } from '../../../../core/models/matches/create-match .model';
import { MatchService } from '../../services/match.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';

@Component({
  selector: 'app-create-match',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, ResultComponent, PlayersComponent, GoalsComponent, CardsComponent, SummaryMatchComponent, MatDatepickerModule, MatStepperModule, MatIcon
    , MatSelectModule, MatRadioModule, MatButtonModule, MatButtonToggleModule, FormsModule],
  templateUrl: './create-match.component.html',
  styleUrl: './create-match.component.css',
})
export class CreateMatchComponent {
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

  isMoreThanTotalGoals: boolean = false;
  isSpecialOptions: boolean = false;
  hideSingleSelectionIndicator = signal(false);

  teamId: number = Number(this.localStorageService.getTeamId());

  card: string = 'yellow';
  equipo: ResultEquipo = {
    id: Number(this.localStorageService.getTeamId()),
    nombre: this.localStorageService.getTeamName(),
    lugar: '',
    escudo: this.localStorageService.getTeamBadge(),
  };


  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateMatchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _teamService: TeamService,
    private _attributesService: AttributesService,
    private _matchService: MatchService,
    private localStorageService: LocalStorageService,



  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getPlayers();
    this.getTypesOfMatches();
  }

  get result() {
    return this.form.get('result') as FormGroup;
  }
  get playerStats(): FormArray {
    return this.form.get('playerStats') as FormArray;
  }

  initForm() {
    this.form = this.fb.group({
      result: this.fb.group({
        NombreRival: ['', Validators.required],
        GolesFavor: [0],
        GolesContra: [0],
        Fecha: ['', Validators.required],
        IdTipoPartido: [1, Validators.required],
        IdTemporada: [this.data.seasonId],
        IdEquipo: [this.teamId],
        IdResultado: [0],
      }),
      playerStats: this.fb.array([]),
    });
  }

  changeSpecialOptions() {
    this.isSpecialOptions = !this.isSpecialOptions;
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

  onCardChange(value: string) {
    this.card = value;
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

  onPlayerSelectionChange(event: any) {
    const selectedPlayerIds = event.value;

    this.selectedParticipatePlayers = this.players
      .filter(player => selectedPlayerIds.includes(player.id))
      .map(player => ({
        Id: player.id,
        Nombre: player.nombre,
        Dorsal: player.dorsal,
        Goles: 0,
        Amarillas: 0,
        Rojas: 0
      }));

    this.selectedParticipatePlayersId = selectedPlayerIds;

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


  getPlayersWithGoals(): PlayerStats[] {
    const defaultPlayers = this.defaultGoals.filter(player => player.Goles > 0);
    const players = this.selectedParticipatePlayers.filter(player => player.Goles > 0)

    return [...defaultPlayers, ...players].sort((a, b) => b.Goles - a.Goles);
  }

  getPlayersWithYellowCards(): PlayerStats[] {
    return this.selectedParticipatePlayers.filter(player => player.Amarillas > 0);
  }

  getPlayersWithRedCards(): PlayerStats[] {
    return this.selectedParticipatePlayers.filter(player => player.Rojas > 0);
  }

  isAnyPlayerCautioned(): boolean {
    return this.selectedParticipatePlayers.some(player => player.Amarillas > 0 || player.Rojas > 0);
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


      this._matchService.createMatch(this.form.value).subscribe({
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
      this.closeDialog();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
