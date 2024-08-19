import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { APIResponse } from '../../../../core/models/api-response.model';
import { CommonModule } from '@angular/common';
import { MatchService } from '../../services/match.service';
import { DeleteMatch } from '../../models/match-delete.model';
@Component({
  selector: 'app-delete-match',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-match.component.html',
  styleUrl: './delete-match.component.css'
})
export class DeleteMatchComponent {


  showErrorMsg: boolean = false;
  errorMessages: string[] = [];

  rivalName: string = '';

  constructor(
    public dialogRef: MatDialogRef<DeleteMatchComponent>,
    private _matchService: MatchService,
    @Inject(MAT_DIALOG_DATA) public data: DeleteMatch
  ) { }

  ngOnInit(): void {
    this.rivalName = this.data.rivalName;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  deleteMatch() {
    this._matchService.deleteMatch(this.data.matchId).subscribe({
      next: (data : APIResponse) => {
        if(!data.isSuccess) {
          console.error('Error deleting the match:', data);
          this.showErrorMsg = true;
          this.errorMessages = data.errorMessages;
          return;
        }
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('An error occurred while deleting the match:', error);
      }
    });
  }

}
