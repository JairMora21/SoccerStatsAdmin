import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  imports: [NavbarComponent],
})
export class InicioComponent {
  constructor(
    private router: Router // Inyectar el Router
  ) {}
  goToTeam() {
    this.router.navigate(['/team']);
  }

  goToMatches() {
    this.router.navigate(['/matches']);
  }
  goToSeasons() {
    this.router.navigate(['/seasons']);
  }
}
