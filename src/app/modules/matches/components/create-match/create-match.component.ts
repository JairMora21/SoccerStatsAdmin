import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-create-match',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule],
  templateUrl: './create-match.component.html',
  styleUrl: './create-match.component.css',
})
export class CreateMatchComponent {
  currentViewIndex: number = 0;

  navigate(direction: number) {
    const newIndex = this.currentViewIndex + direction;
    if (newIndex >= 0 && newIndex <= 4) {
      this.currentViewIndex = newIndex;
    }
  }
}
