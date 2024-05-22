import { Component } from '@angular/core';
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";

@Component({
    selector: 'app-seasons',
    standalone: true,
    templateUrl: './seasons.component.html',
    styleUrl: './seasons.component.css',
    imports: [NavbarComponent]
})
export class SeasonsComponent {

}
