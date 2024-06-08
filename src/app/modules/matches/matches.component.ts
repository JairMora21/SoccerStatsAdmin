import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { Router } from '@angular/router';
import { LOCAL_STORAGE } from '../../shared/Constants/local-storage';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-matches',
    standalone: true,
    templateUrl: './matches.component.html',
    styleUrl: './matches.component.css',
    imports: [NavbarComponent, CommonModule, MatMenuModule, MatIconModule, FormsModule],
})
export class MatchesComponent {

    filteredSeasons: any[] = [];


    sortData(column: any) {
    }

    deleteSeason() {
    }

    editSeason() {  
    }
}
