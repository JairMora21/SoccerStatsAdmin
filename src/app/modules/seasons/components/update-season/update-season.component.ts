

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
import { ITemporadsUpdate } from '../../../../core/models/seasons/update-season.model';
import { AttributesService } from '../../../../shared/services/attributes.service';
import { IClasification, ResultClasification } from '../../../../core/models/attributes/clasification.model';
import { ITemporada } from '../../../../core/models/seasons/season.model';

@Component({
  selector: 'app-update-season',
  standalone: true,
  imports: [ CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,],
  templateUrl: './update-season.component.html',
  styleUrl: './update-season.component.css'
})
export class UpdateSeasonComponent {

  clasificationes: ResultClasification[] = [];
  seasonForm: FormGroup = new FormGroup({});
  attemptedSubmit = false;  
  idClasificacion: number = 0;

  constructor(
    public dialogRef: MatDialogRef<UpdateSeasonComponent>,
    public _seasonService: SeasonService, 
    private _attributesService: AttributesService,
    @Inject(MAT_DIALOG_DATA) public season: ITemporada
  ) { }

  ngOnInit(): void {
    console.log(this.season);
    
    this.getClasificacion();
    this.initForm();
  }

  initForm() {
    this.seasonForm = new FormGroup({
      nombreTemporada: new FormControl(this.season.nombreTemporada, [Validators.required]),
      fechaInicio: new FormControl(this.season.fechaInicio, [Validators.required]),
      noTemporada: new FormControl(this.season.noTemporada, [Validators.required]),
      fechaFinal: new FormControl(this.season.fechaFinal ?? ''), 
      posicion: new FormControl(this.season.posicion ?? ''), 
      idClasificacion: new FormControl(this.season.idClasificacion)
    });
  }

  getClasificacion() {
    this._attributesService.getClassifications().subscribe({
      next: (data : IClasification) => {
        if (data.isSuccess == false) {
          console.error('Error al obtener clasification:', data.errorMessages);
        } else {
          this.clasificationes = data.result;
        }
      },
      error: (error) => {
        console.error('An error occurred while fetching clasification:', error);
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  editSeason() {
    this.attemptedSubmit = true;
    console.log(this.seasonForm.value);

    if(this.seasonForm.value.fechaFinal == '') {}

    const newSeason: ITemporadsUpdate = {
      idEquipo: Number(localStorage.getItem(LOCAL_STORAGE.TeamId)),
      nombreTemporada: this.seasonForm.value.nombreTemporada,
      fechaInicio: this.seasonForm.value.fechaInicio instanceof Date ?
                    this.seasonForm.value.fechaInicio.toISOString().split('T')[0] :
                    this.seasonForm.value.fechaInicio,
      noTemporada: this.seasonForm.value.noTemporada,
      fechaFinal: this.seasonForm.value.fechaFinal instanceof Date ?
                  this.seasonForm.value.fechaFinal.toISOString().split('T')[0] :
                  this.seasonForm.value.fechaFinal,
      posicion: this.seasonForm.value.posicion,
      idClasificacion: this.seasonForm.value.idClasificacion
  };
  
  
  console.log(newSeason);
  

    console.log(newSeason);
    
    
    if (this.seasonForm.invalid) {
      return;
    }

    this._seasonService.updateSeason(this.season.id,newSeason).subscribe({
      next: (data) => {
        console.log(data);
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('An error occurred while updating the season:', error);
      }
    });

  }

  
  convertDateToISOString(dateString: string): string {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    const isoString = date.toISOString();

    return isoString;
}

}



