import { Component } from '@angular/core';
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";

@Component({
    selector: 'app-matches',
    standalone: true,
    templateUrl: './matches.component.html',
    styleUrl: './matches.component.css',
    imports: [NavbarComponent]
})
export class MatchesComponent {

}
