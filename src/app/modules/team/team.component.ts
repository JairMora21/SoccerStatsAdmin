import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { TeamService } from './services/team.service';
import { Router } from '@angular/router';
import { LOCAL_STORAGE } from '../../shared/Constants/local-storage';
import { IJugadores, ResultPlayers } from './models/players.model';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreatePlayerComponent } from './components/create-player/create-player.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { DeletePlayerComponent } from './components/delete-player/delete-player.component';
import { EditPlayerComponent } from './components/edit-player/edit-player.component';

@Component({
  selector: 'app-team',
  standalone: true,
  templateUrl: './team.component.html',
  styleUrl: './team.component.css',
  imports: [NavbarComponent, CommonModule, MatMenuModule, MatIconModule],
})
export class TeamComponent {
  players: ResultPlayers[] = [];

  constructor(
    public dialog: MatDialog,
    private _teamService: TeamService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getPlayers();
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

  createPlayer() {
    const dialogRef = this.dialog.open(CreatePlayerComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getPlayers();
    });
  }

  deletePlayer(id: number, name: string) {
    const dialogRef = this.dialog.open(DeletePlayerComponent, {
      disableClose: true,
      data: { id: id, name: name},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getPlayers();
    });
  }

  editPlayer(player: ResultPlayers) {
    const dialogRef = this.dialog.open(EditPlayerComponent, {
      disableClose: true,
      height: '85%',
      width: '430px',
      data: { player: player },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getPlayers();
    });
  }
}
