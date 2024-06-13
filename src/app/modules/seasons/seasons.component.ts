import { Component, Injector } from '@angular/core';
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
import { CreateSeasonComponent } from './components/create-season/create-season.component';
import { UpdateSeasonComponent } from './components/update-season/update-season.component';
import { DeleteSeasonComponent } from './components/delete-season/delete-season.component';


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
        private injector: Injector,
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
        this._seasonService.getSeasons(teamId).subscribe({
            next: (data: ResultTemporadas) => {
                if (!data.isSuccess) {
                    console.error('Error retrieving seasons:', data);
                    return;
                }
                this.seasons = data.result;
                this.filteredSeasons = [...this.seasons]; 
                console.log('Seasons:', this.seasons);
                
            },
            error: (error) => {
                console.error('An error occurred while fetching seasons:', error);
            }
        });
    }

    sortColumn: string = 'noTemporada';
    sortOrder: 'asc' | 'desc' = 'asc';
    
    sortData(column: keyof ITemporada) { // Asegúrate de que SeasonType sea la interfaz adecuada para tus temporadas
      if (this.sortColumn === column) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortOrder = 'asc';
      }
    
    this.filteredSeasons.sort((a, b) => {
      let valueA = a[column] ?? "";
      let valueB = b[column] ?? "";
    
      if (column === 'fechaInicio' || column === 'fechaFinal') {
        // Convertir Date a string si es necesario
        if (valueA instanceof Date) valueA = valueA.toISOString();
        if (valueB instanceof Date) valueB = valueB.toISOString();
    
        // Ahora valueA y valueB son strings y puedes usar localeCompare
        return this.sortOrder === 'asc' ? valueA.toString().localeCompare(valueB.toString()) : valueB.toString().localeCompare(valueA.toString());
      } else {
        valueA = valueA.toString().toLowerCase();
        valueB = valueB.toString().toLowerCase();
        if (valueA < valueB) {
          return this.sortOrder === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return this.sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      }
    });
    }
    

    deleteSeason(seasonName :string, seasonId: number) {
        const dialogRef = this.dialog.open(DeleteSeasonComponent, {
            data: {seasonName: seasonName, seasonId: seasonId},
            injector: this.injector,
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getSeasons();
        });
    }

    editSeason(season: ITemporada) {  
        const dialogRef = this.dialog.open(UpdateSeasonComponent, {
            data: season,
            injector: this.injector,
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getSeasons();
        });
    }
    createSeason() {
        const dialogRef = this.dialog.open(CreateSeasonComponent, {
            data: {},
            injector: this.injector,
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getSeasons();
        });


    }
}
