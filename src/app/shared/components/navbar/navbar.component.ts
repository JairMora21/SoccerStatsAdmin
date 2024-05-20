import { Component } from '@angular/core';
import { TeamService } from '../../../modules/team/services/team.service';
import { IEquipos, ResultEquipo } from '../../../modules/team/models/equipos.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  equipos: ResultEquipo[] = [];

  constructor(
    private _teamService: TeamService
  ) { }

  ngOnInit(): void {
    this.getAllTeams();
  }

  getAllTeams() {
    this._teamService.getAllTeams().subscribe({
      next: (data: IEquipos) => {
        if(data.isSuccess == false){
          console.error('Error al obtener equipos', data.errorMessages);
        } else {
          this.equipos = data.result;
          console.log('Equipos obtenidos', this.equipos);
        }
      },
      error: (error) => {
        console.error('Error al obtener equipos', error);
      }
    });
  }
}
