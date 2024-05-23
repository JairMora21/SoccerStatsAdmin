import { Component } from '@angular/core';
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
import { TeamService } from './services/team.service';
import { Router } from '@angular/router';
import { LOCAL_STORAGE } from '../../shared/Constants/local-storage';
import { IJugadores, ResultPlayers } from './models/players.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-team',
    standalone: true,
    templateUrl: './team.component.html',
    styleUrl: './team.component.css',
    imports: [NavbarComponent, CommonModule]
})
export class TeamComponent {

    players: ResultPlayers[] = [];

    constructor(private _teamService: TeamService, private router: Router) {}

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
}
