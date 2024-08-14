import { Component, Input } from '@angular/core';
import { TeamService } from '../../../modules/team/services/team.service';
import {IEquipos,ResultEquipo} from '../../../modules/team/models/equipos.model';
import { CommonModule } from '@angular/common';
import { LOCAL_STORAGE } from '../../Constants/local-storage';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LocalStorageService } from '../../services/local-storage.service';


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

  constructor(
    private _teamService: TeamService, 
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {}

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
            this.localStorageService.setTeamId(this.equipos[0].id.toString());
            this.localStorageService.setTeamBadge(this.equipos[0].escudo);
            this.localStorageService.setTeamName(this.equipos[0].nombre);
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
    this.localStorageService.setTeamId(team.id.toString());
    this.localStorageService.setTeamBadge(team.escudo);
    this.localStorageService.setTeamName(team.nombre);
  }

  logout() {
    localStorage.removeItem(LOCAL_STORAGE.Token);
    localStorage.removeItem(LOCAL_STORAGE.Refreshtoken);
    localStorage.removeItem(LOCAL_STORAGE.Expiration);
    localStorage.removeItem(LOCAL_STORAGE.TeamId);
    localStorage.removeItem(LOCAL_STORAGE.TeamBadge);
    this.router.navigate(['/login']);

  }

  mainPage() {
    this.router.navigate(['/main']);
  }
}
