import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'app-delete-player',
  standalone: true,
  imports: [],
  templateUrl: './delete-player.component.html',
  styleUrl: './delete-player.component.css'
})
export class DeletePlayerComponent {

  playerName: string = '';

  constructor(
    public dialogRef: MatDialogRef<DeletePlayerComponent>,
    private _teamService: TeamService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.playerName = this.data.name;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  deletePlayer() {
    this._teamService.deletePlayer(this.data.id).subscribe({
      next: (data) => {
        console.log(data);
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error al eliminar jugador', error);
      }
    });
  }

}
