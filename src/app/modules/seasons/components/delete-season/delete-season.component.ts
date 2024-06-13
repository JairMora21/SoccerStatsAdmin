import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SeasonService } from '../../services/season.service';
import { APIResponse } from '../../../../core/models/api-response.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-delete-season',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-season.component.html',
  styleUrl: './delete-season.component.css'
})
export class DeleteSeasonComponent {

  seasonName: string = '';
  showErrorMsg: boolean = false;
  errorMessages: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<DeleteSeasonComponent>,
    private _seasonService: SeasonService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.seasonName = this.data.seasonName;    
  }

  closeDialog() {
    this.dialogRef.close();
  }

  deleteSeason() {
    console.log('Eliminando temporada', this.data.seasonName);
    this._seasonService.deleteSeason(this.data.seasonId).subscribe({
      next: (data : APIResponse) => {
        if(!data.isSuccess) {
          console.error('Error deleting the season:', data);
          this.showErrorMsg = true;
          this.errorMessages = data.errorMessages;

          return;
        }
        console.log('Season deleted:', data);
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('An error occurred while deleting the season:', error);
      }
    });
  }

}
