import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { LoginDto as LoginDto } from './dto/login.dto';
import { AuthResponse } from './models/auth-response.model';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    const loginData: LoginDto = {
      nombreUsuario: this.username,
      clave: this.password
    };

    this.authService.login(loginData).subscribe(
      (response: AuthResponse) => {
        if (response.resultado) {
          console.log('Token:', response.token);
          localStorage.setItem('authToken', response.token!);  
          localStorage.setItem('refreshToken', response.refreshToken!);
          this.router.navigate(['/players']);
        } else {
          console.error('Error:', response.msg);
        }
      },
      error => {
        console.error('Login error', error);
      }
    );
  }
}
