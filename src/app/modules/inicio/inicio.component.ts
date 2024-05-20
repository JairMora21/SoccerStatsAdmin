import { Component } from '@angular/core';
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";

@Component({
    selector: 'app-inicio',
    standalone: true,
    templateUrl: './inicio.component.html',
    styleUrl: './inicio.component.css',
    imports: [NavbarComponent]
})
export class InicioComponent {

}
