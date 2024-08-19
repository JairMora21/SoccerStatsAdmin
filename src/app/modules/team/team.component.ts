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
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-team',
  standalone: true,
  templateUrl: './team.component.html',
  styleUrl: './team.component.css',
  imports: [NavbarComponent, CommonModule, MatMenuModule, MatIconModule, FormsModule],
})
export class TeamComponent {
  
  players: ResultPlayers[] = [];
  filteredPlayers: ResultPlayers[] = [];


  searchInput: string = '';
  filterData() {
    if (!this.searchInput) {
      this.filteredPlayers = this.players; 
    } else {
      this.filteredPlayers = this.players.filter(player =>
        player.nombre.toLowerCase().includes(this.searchInput.toLowerCase()) ||
        player.apellido.toLowerCase().includes(this.searchInput.toLowerCase()) ||
        player.dorsal.includes(this.searchInput) ||
        player.posicion.toLowerCase().includes(this.searchInput.toLowerCase()) 
      );
    }
  }

  sortColumn = 'nombre'; 
  sortOrder = 'asc'; 

  searchTerm: string = '';


  constructor(
    public dialog: MatDialog,
    private _teamService: TeamService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getPlayers();
  }

  sortData(column: keyof ResultPlayers) {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
  
    this.players.sort((a, b) => {
      let valueA = a[column];
      let valueB = b[column];
  
      valueA = (valueA ?? "").toString();
      valueB = (valueB ?? "").toString();
  
      // Comparación especial para el dorsal ya que es un string pero se debe comparar como número
      if (column === 'dorsal') {
        const numA = parseInt(valueA, 10);
        const numB = parseInt(valueB, 10);
        if (!isNaN(numA) && !isNaN(numB)) {
          return this.sortOrder === 'asc' ? numA - numB : numB - numA;
        }
      }
      // Comparación general como strings
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
      if (valueA < valueB) {
        return this.sortOrder === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  
  

  getPlayers() {
    const teamId = Number(localStorage.getItem(LOCAL_STORAGE.TeamId));

    this._teamService.getAllPlayers(teamId).subscribe({
      next: (data: IJugadores) => {
        if (data.isSuccess == false) {
          console.error('Error al obtener jugadores', data.errorMessages);
        } else {
          this.players = data.result;
          this.filteredPlayers = this.players;
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
      data: player,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getPlayers();
    });
  }
}
