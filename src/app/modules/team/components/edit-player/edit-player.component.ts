import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormsModule,
  Validators,
} from '@angular/forms';
import {
  IPositionsPlayers,
  ResultPositions,
} from '../../../../core/models/attributes/positions.model';
import { CreatePlayerComponent } from '../create-player/create-player.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AttributesService } from '../../../../shared/services/attributes.service';
import { TeamService } from '../../services/team.service';
import { ReactiveFormsModule } from '@angular/forms';
import { LOCAL_STORAGE } from '../../../../shared/Constants/local-storage';
import { CommonModule } from '@angular/common';
import { ResultPlayers } from '../../models/players.model';
import { IUpdatePlayer } from '../../../../core/models/players/update-player.model';

@Component({
  selector: 'app-edit-player',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-player.component.html',
  styleUrl: './edit-player.component.css',
})
export class EditPlayerComponent {
  playerForm: FormGroup = new FormGroup({});
  positions: ResultPositions[] = [];

  attemptedSubmit = false; // Esta propiedad indica si se ha intentado enviar el formulario
  

  constructor(
    public dialogRef: MatDialogRef<CreatePlayerComponent>,
    private _teamService: TeamService,
    private _attributesService: AttributesService,
    @Inject(MAT_DIALOG_DATA) public player: ResultPlayers

  ) {}

  ngOnInit(): void {
    this.getPositions();
    this.initForm();

  }

  getPositions() {
    this._attributesService.getPositions().subscribe({
      next: (data: IPositionsPlayers) => {
        if (data.isSuccess == false) {
          console.error('Error al obtener posiciones', data.errorMessages);
        } else {
          this.positions = data.result;
        }
      },
      error: (error) => {
        console.error('Error al obtener posiciones', error);
      },
    });
  }

  initForm() {
    this.playerForm = new FormGroup({
      nombre: new FormControl(this.player.nombre, [Validators.required]),
      apellido: new FormControl(this.player.apellido, [Validators.required]),
      posicion: new FormControl(this.player.idPosicion, [Validators.required]),
      dorsal: new FormControl(this.player.dorsal, [Validators.required]),
    });
  }

  updatePlayer() {
    if (this.playerForm.invalid) {
      this.attemptedSubmit = true;
      return;
    }

    const playerToUpdate: IUpdatePlayer = {
      Nombre: this.playerForm.value.nombre,
      Apellido: this.playerForm.value.apellido,
      Dorsal: this.playerForm.value.dorsal,
      IdPosicion: this.playerForm.value.posicion,
      Activo: this.player.activo,
      IdEquipo: Number(localStorage.getItem(LOCAL_STORAGE.TeamId)),
    };

    
    this._teamService.updatePlayer(this.player.id, playerToUpdate).subscribe({
      next: (data) => {
        if (data.isSuccess == false) {
          console.error('Error al actualizar jugador', data.errorMessages);
        } else {
          
          
          this.dialogRef.close();
        }
      },
      error: (error) => {
        console.error('Error al actualizar jugador', error);
      },
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
