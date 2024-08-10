import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { Router } from '@angular/router';
import { LOCAL_STORAGE } from '../../shared/Constants/local-storage';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatchService } from './services/match.service';
import { SeasonService } from '../seasons/services/season.service';
import {
  ITemporada,
  ResultTemporadas,
} from '../../core/models/seasons/season.model';
import {
  IMatches,
  IResultMatch,
} from '../../core/models/matches/matches.model';
import { get } from 'http';
import { firstValueFrom } from 'rxjs';
import { DeleteMatchComponent } from './components/delete-match/delete-match.component';
import { CreateMatchComponent } from './components/create-match/create-match.component';
import { ViewMatchComponent } from './components/view-match/view-match.component';
@Component({
  selector: 'app-matches',
  standalone: true,
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.css',
  imports: [
    NavbarComponent,
    CommonModule,
    MatMenuModule,
    MatIconModule, 
    FormsModule,
  ],
  encapsulation: ViewEncapsulation.Emulated // O ShadowDom

})
export class MatchesComponent {
  lastSeasonId: number = 0;
  searchInput: string = '';
  filteredMatches: IResultMatch[] = [];
  seasons: ITemporada[] = [];
  seasonSelectd: number = 0;

  matches: IResultMatch[] = [];

  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private injector: Injector,
    private dialog: MatDialog,
    private _matchService: MatchService,
    private _seasonService: SeasonService

  ) { }

  async ngOnInit() {
    await this.getSeasons();
    console.log('Seasons:', this.seasonSelectd);
    if (this.seasonSelectd > 0) {
      this.getMatches(this.seasonSelectd);
    } else {
      console.log('ID de temporada no disponible para cargar partidos.');
    }
  }

  async getSeasons() {
    const idTeam = localStorage.getItem(LOCAL_STORAGE.TeamId);
    if (idTeam) {
      try {
        const data: ResultTemporadas = await firstValueFrom(
          this._seasonService.getSeasons(+idTeam)
        );
        if (data.isSuccess) {
          this.seasons = data.result;
          if (this.seasons.length > 0) {
            const lastSeason = this.seasons[this.seasons.length - 1];
            this.seasonSelectd = lastSeason.id;
          } else {
            console.log('No hay temporadas disponibles.');
          }
        } else {
          console.log(data.errorMessages);
        }
      } catch (error) {
        console.log('Error al obtener las temporadas:', error);
      }
    } else {
      console.log('ID de equipo no encontrado en almacenamiento local.');
    }
  }

  ViewMatch(idMatch: number) { 
    const dialogRef = this.dialog.open(ViewMatchComponent, {
      data: {
        idMatch: idMatch,
      },
      injector: this.injector,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getMatches(this.seasonSelectd);
    });
  }
  getMatches(idSeason: number = 0) {
    if (idSeason) {
      this._matchService.showMatches(idSeason).subscribe((data: IMatches) => {
        if (data.isSuccess) {
          this.matches = data.result;
          this.matches.sort((a, b) => {
            const dateA = new Date(a.fecha);
            const dateB = new Date(b.fecha);
            return dateA.getTime() - dateB.getTime();
          });
          this.filteredMatches = this.matches;
        } else {
          console.log(data.errorMessages);
        }
      });
    }
  }

  onSeasonChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement | null;
    if (selectElement) {
      const seasonId = selectElement.value;
      this.seasonSelectd = +seasonId;
      this.getMatches(+seasonId);
    } else {
      console.log('No se pudo obtener el select element');
    }
  }

  sortData(column: keyof IResultMatch) {
    // Asegúrate de que IResultMatch sea la interfaz adecuada para tus partidos
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }

    this.filteredMatches.sort((a, b) => {
      let valueA = a[column] ?? '';
      let valueB = b[column] ?? '';

      if (column === 'fecha') {
        // Convertir Date a string si es necesario
        if (valueA instanceof Date) valueA = valueA.toISOString();
        if (valueB instanceof Date) valueB = valueB.toISOString();

        // Ahora valueA y valueB son strings y puedes usar localeCompare
        return this.sortOrder === 'asc'
          ? String(valueA).localeCompare(String(valueB))
          : String(valueB).localeCompare(String(valueA));
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        // Comparación directa si son números
        return this.sortOrder === 'asc'
          ? valueA - valueB
          : valueB - valueA;
      } else {
        // Comparación por defecto si son strings u otros
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

  filterData() {
    console.log('searchInput:', this.searchInput);
    if (!this.searchInput) {
      this.filteredMatches = this.matches;
    } else {
      this.filteredMatches = this.matches.filter(
        (match) =>
          match.nombreRival.toLowerCase().includes(this.searchInput.toLowerCase()) ||
          match.fecha.toString().includes(this.searchInput) ||
          match.resultado.toString().includes(this.searchInput) ||
          match.golesContra.toString().includes(this.searchInput) ||
          match.golesFavor.toString().includes(this.searchInput)


      );
    }

  }


  editSeason() { }


  createMatch() {
    const dialogRef = this.dialog.open(CreateMatchComponent, {
      data: {
        seasonId: this.seasonSelectd,
      },
      injector: this.injector,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getMatches(this.seasonSelectd);
    });
  }

  deleteMatch(rivalName: string, matchId: number) {

    const dialogRef = this.dialog.open(DeleteMatchComponent, {
      data: { rivalName, matchId },
      injector: this.injector,

    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getMatches(this.seasonSelectd);
    });
  }

  editMatch(match: any) { }
}
