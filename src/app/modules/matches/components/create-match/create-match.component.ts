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
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    { id: 0, nombre: 'Autogol', dorsal: '', goles: 0, amarillas: 0, rojas: 0 },
    { id: 0, nombre: 'Invitado', dorsal: '', goles: 0, amarillas: 0, rojas: 0 }

  ];

  isMoreThanTotalGoals: boolean = false;
  isSpecialOptions: boolean = false;
  hideSingleSelectionIndicator = signal(false);

  card: string = 'yellow';
  equipo: ResultEquipo = { id: 0, nombre: '', lugar: '', escudo: '' };


  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _teamService: TeamService,
    private _attributesService: AttributesService


  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      result: this.fb.group({
        nombreRival: ['a', Validators.required],
        golesFavor: [0],
        golesContra: [0],
        fecha: ['aa', Validators.required],
        typeOfMatch: [1, Validators.required],
      }),
      playerStats: this.fb.array([]),
    });
    this.getPlayers();
    this.getTeamData();
    this.getTypesOfMatches();
  }

  get result() {
    return this.form.get('result') as FormGroup;
  }
  get playerStats(): FormArray {
    return this.form.get('playerStats') as FormArray;
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

  getTeamData() {
    const teamId = Number(localStorage.getItem(LOCAL_STORAGE.TeamId));
    this._teamService.getTeamById(teamId).subscribe({
      next: (data: any) => {
        if (data.isSuccess == false) {
          console.error('Error al obtener equipo', data.errorMessages);
        } else {
          console.log(data.result);
          this.equipo = data.result;
        }
      },
      error: (error) => {
        console.error('Error al obtener equipo', error);
      },
    });
  }
  onCardChange(value: string) {
    this.card = value;
  }

  getPlayers() {
    const teamId = Number(localStorage.getItem(LOCAL_STORAGE.TeamId));

    this._teamService.getAllPlayers(teamId).subscribe({
      next: (data: IJugadores) => {
        if (data.isSuccess == false) {
          console.error('Error al obtener jugadores', data.errorMessages);
        } else {
          console.log(data.result);
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
      .map(player => ({ id: player.id, nombre: player.nombre, dorsal: player.dorsal, goles: 0, amarillas: 0, rojas: 0 }));

    this.selectedParticipatePlayersId = selectedPlayerIds;

    //console.log(this.selectedParticipatePlayers);
    console.log('selectedParticipatePlayersId:', selectedPlayerIds);
  }

  navigate(direction: number) {
    console.log('selectedParticipatePlayersId:', this.selectedParticipatePlayersId);

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
    const totalGoalsPlayers = this.selectedParticipatePlayers.reduce((acc, player) => acc + player.goles, 0);
    const totalGoalsDefault = this.defaultGoals.reduce((acc, player) => acc + player.goles, 0);
    const totalGoals = totalGoalsPlayers + totalGoalsDefault;
    const goalsInMatch = this.form.get('result.golesFavor')?.value;
    if (totalGoals >= goalsInMatch) {
      this.isMoreThanTotalGoals = true
      return;
    }
    this.isMoreThanTotalGoals = false;
    player.goles += 1;
    console.log(this.selectedParticipatePlayers);
  }

  removeGoal(player: PlayerStats) {
    this.isMoreThanTotalGoals = false;
    if (player.goles > 0) {
      player.goles -= 1;
    }
    console.log(this.selectedParticipatePlayers);
  }

  addCard(player: PlayerStats, cardType: string) {
    console.log('adding card to player:', player.nombre);
    console.log('Card type:', cardType);
    if (cardType == 'yellow') {
      player.amarillas += 1;
    } else {
      player.rojas += 1;
    }
  }

  removeCard(player: PlayerStats, cardType: string) {
    console.log('removin card to player:', player.nombre);
    console.log('Card type:', cardType);
    if (cardType == 'yellow') {
      if (player.amarillas > 0) {
        player.amarillas -= 1;
      }
    } else {
      if (player.rojas > 0) {
        player.rojas -= 1;
      }
    }
  }


  getPlayersWithGoals(): PlayerStats[] {
    const defaultPlayers = this.defaultGoals.filter(player => player.goles > 0);
    const players = this.selectedParticipatePlayers.filter(player => player.goles > 0)

    return [...defaultPlayers, ...players].sort((a, b) => b.goles - a.goles);
  }

  getPlayersWithYellowCards(): PlayerStats[] {
    return this.selectedParticipatePlayers.filter(player => player.amarillas > 0);
  }

  getPlayersWithRedCards(): PlayerStats[] {
    return this.selectedParticipatePlayers.filter(player => player.rojas > 0);
  }

  isAnyPlayerCautioned(): boolean {
    return this.selectedParticipatePlayers.some(player => player.amarillas > 0 || player.rojas > 0);
  }

  onSubmit() {
    const defaultPlayers = this.defaultGoals.filter(player => player.goles > 0);
    this.selectedParticipatePlayers = [...defaultPlayers, ...this.selectedParticipatePlayers];

    // Limpiar el FormArray antes de llenarlo
    this.playerStats.clear();

    // Agregar todos los jugadores seleccionados al FormArray como objetos completos
    this.selectedParticipatePlayers.forEach(player => {
      this.playerStats.push(this.fb.group(player));
    });
    console.log(this.form.value);

    if (this.form.valid) {
      console.log(this.form.value);
      console.log('selectedParticipatePlayersId:', this.selectedParticipatePlayers);

    }
  }
}

interface PlayerStats {
  id: number;
  nombre: string;
  dorsal: string;
  goles: number;
  amarillas: number;
  rojas: number;
}
