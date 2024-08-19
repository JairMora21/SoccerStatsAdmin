import { Component, Input } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [
    MatDatepickerModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule,
    MatIcon
  ],
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent {
  @Input() formGroup!: FormGroup;
  number: string = '0';

  ngOnInit(): void {
    }

  get nombreRival(): AbstractControl | null {
    return this.formGroup.get('result.nombreRival');
  }

  get golesFavor(): AbstractControl | null {
    return this.formGroup.get('result.golesFavor');
  }

  get golesContra(): AbstractControl | null {
    return this.formGroup.get('result.golesContra');
  }

  get fechaInicio(): AbstractControl | null {
    return this.formGroup.get('result.fechaInicio');
  }
  decrementValue(controlName: string): void {
    const control = this.formGroup.get(controlName);
    if (control) {
      control.setValue(Math.max(0, (control.value || 0) - 1));
    }
  }

  incrementValue(controlName: string): void {
    const control = this.formGroup.get(controlName);
    if (control) {
      control.setValue((control.value || 0) + 1);
    }
  }
}
