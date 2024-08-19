import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, Validators } from '@angular/forms'; // Importar FormsModule
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { LOCAL_STORAGE } from '../../../../shared/Constants/local-storage';
import { SeasonService } from '../../services/season.service';
import { ITemporadaCreate } from '../../../../core/models/seasons/create-season.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-create-season',
  standalone: true,
  imports: [ CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,],
  templateUrl: './create-season.component.html',
  styleUrl: './create-season.component.css'
})
export class CreateSeasonComponent {

  seasonForm: FormGroup = new FormGroup({});
  attemptedSubmit = false;  // Esta propiedad indica si se ha intentado enviar el formulario


  constructor(
    public dialogRef: MatDialogRef<CreateSeasonComponent>,
    public _seasonService: SeasonService, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.seasonForm = new FormGroup({
      nombreTemporada: new FormControl('', [Validators.required]),
      fechaInicio: new FormControl('', [Validators.required]),
      noTemporada: new FormControl('', [Validators.required])
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  createSeason() {
    this.attemptedSubmit = true;
    const newSeason: ITemporadaCreate = {
      idEquipo: Number(localStorage.getItem(LOCAL_STORAGE.TeamId)),
      nombreTemporada: this.seasonForm.value.nombreTemporada,
      fechaInicio: this.seasonForm.value.fechaInicio instanceof Date ?
                    this.seasonForm.value.fechaInicio.toISOString().split('T')[0] :
                    this.seasonForm.value.fechaInicio,
      noTemporada: this.seasonForm.value.noTemporada
    }

    
    
    if (this.seasonForm.invalid) {
      return;
    }

    this._seasonService.createSeason(newSeason).subscribe({
      next: (data) => {
        if (!data.isSuccess) {
          console.error('Error al crear temporada', data.errorMessages);
        } else {
          this.dialogRef.close();
        }
      }
    });

  }

}
