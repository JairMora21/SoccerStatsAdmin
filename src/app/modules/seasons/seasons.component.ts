import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { Router } from '@angular/router';
import { LOCAL_STORAGE } from '../../shared/Constants/local-storage';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ITemporada, ResultTemporadas } from '../../core/models/seasons/season.model';
import { SeasonService } from './services/season.service';


@Component({
    selector: 'app-seasons',
    standalone: true,
    templateUrl: './seasons.component.html',
    styleUrl: './seasons.component.css',
    imports: [NavbarComponent, CommonModule, MatMenuModule, MatIconModule, FormsModule],
})
export class SeasonsComponent {

    filteredSeasons: ITemporada[] = [];
    seasons: ITemporada[] = [];


    constructor(
        private router: Router, 
        private dialog: MatDialog,
        private _seasonService: SeasonService,
    ) {
    }

    ngOnInit() {
        this.getSeasons();
    }
    getSeasons() {
        const teamId = Number(localStorage.getItem(LOCAL_STORAGE.TeamId));
        if (isNaN(teamId)) {
            console.error('Invalid Team ID');
            return;
        }
        console.log(teamId)
        this._seasonService.getSeasons(teamId).subscribe({
            next: (data: ResultTemporadas) => {
                if (!data.isSuccess) {

                    console.error('Error retrieving seasons:', data);
                    return;
                }
                this.seasons = data.result;
                this.filteredSeasons = [...this.seasons]; // Clonamos el array para evitar mutaciones directas
            },
            error: (error) => {
                console.error('An error occurred while fetching seasons:', error);
            }
        });
    }
    sortData(column: any) {
    }

    deleteSeason() {
    }

    editSeason() {  
    }
}
