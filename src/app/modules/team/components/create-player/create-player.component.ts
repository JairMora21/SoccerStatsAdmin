import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TeamService } from '../../services/team.service';
import { AttributesService } from '../../../../shared/services/attributes.service';
import { IPositionsPlayers, ResultPositions } from '../../../../core/models/attributes/positions.model';
import { CommonModule } from '@angular/common';
import { FormsModule, Validators } from '@angular/forms'; // Importar FormsModule
import { ICreatePlayer } from '../../../../core/models/players/create-player.model';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { LOCAL_STORAGE } from '../../../../shared/Constants/local-storage';




@Component({
  selector: 'app-create-player',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-player.component.html',
  styleUrl: './create-player.component.css'
})
export class CreatePlayerComponent {



  playerForm: FormGroup = new FormGroup({});
  positions: ResultPositions[] = [];
  attemptedSubmit = false;  // Esta propiedad indica si se ha intentado enviar el formulario



  constructor(
    public dialogRef: MatDialogRef<CreatePlayerComponent>,
    private _teamService: TeamService,
    private _attributesService: AttributesService,
    
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.playerForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      dorsal: new FormControl('', [Validators.required]),
      selectedPosition: new FormControl('', [Validators.required])
    });
    this.getPositions();
  }

  closeDialog() {
    this.dialogRef.close();
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
      }
    })
  }

  createPlayer() {
    this.attemptedSubmit = true;  
    if (this.playerForm.valid) {
      const playerData: ICreatePlayer = {
        Nombre: this.playerForm.value.nombre,
        Apellido: this.playerForm.value.apellido,
        Dorsal: this.playerForm.value.dorsal.toString(),
        IdEquipo: Number(localStorage.getItem(LOCAL_STORAGE.TeamId) || '0'), 
        IdPosicion: this.playerForm.value.selectedPosition,
        Activo: true
      };
      

      
      
      this._teamService.createPlayer(playerData).subscribe({
        next: (data) => {
          if (data.isSuccess == false) {
            console.error('Error al crear jugador', data.errorMessages);
          } else {
            this.dialogRef.close();
          }
        },
        error: (error) => {
          console.error('Error al crear jugador', error);
        }
      });
    } else {
     
      this.playerForm.markAllAsTouched(); 
    }
  }  
}
