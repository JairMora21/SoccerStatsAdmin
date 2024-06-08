import { Component, Input } from '@angular/core';
import { TeamService } from '../../../modules/team/services/team.service';
import {IEquipos,ResultEquipo} from '../../../modules/team/models/equipos.model';
import { CommonModule } from '@angular/common';
import { LOCAL_STORAGE } from '../../Constants/local-storage';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  equipos: ResultEquipo[] = [];
  currentTeam: string = '';
  @Input() isTeamSelected: boolean = false;

  constructor(private _teamService: TeamService, private router: Router) {}

  ngOnInit(): void {
    this.getAllTeams();
  }

  getAllTeams() {
    this._teamService.getAllTeams().subscribe({
      next: (data: IEquipos) => {
        if (data.isSuccess == false) {
          console.error('Error al obtener equipos', data.errorMessages);
        } else {
          this.equipos = data.result;
          if (this.equipos && this.equipos.length > 0) {
            this.currentTeam = this.equipos[0].nombre;
            localStorage.setItem(LOCAL_STORAGE.TeamId, this.equipos[0].id.toString());
          }
        }
      },
      error: (error) => {
        console.error('Error al obtener equipos', error);
      },
    });
  }

  changeTeam(team: ResultEquipo) {
    this.currentTeam = team.nombre;
    localStorage.setItem(LOCAL_STORAGE.TeamId, team.id.toString());
  }

  logout() {
    localStorage.removeItem(LOCAL_STORAGE.Token);
    localStorage.removeItem(LOCAL_STORAGE.Refreshtoken);
    localStorage.removeItem(LOCAL_STORAGE.Expiration);
    this.router.navigate(['/login']);

  }

  mainPage() {
    this.router.navigate(['/main']);
  }
}
