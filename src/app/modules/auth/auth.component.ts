import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { LoginDto as LoginDto } from './dto/login.dto';
import { AuthResponse } from './models/auth-response.model';
import { Router } from '@angular/router'; 
import { LOCAL_STORAGE } from '../../shared/Constants/local-storage';
import { isPlatformBrowser } from '@angular/common';

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

  constructor(
    private authService: AuthService, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  login() {
    const loginData: LoginDto = {
      nombreUsuario: this.username,
      clave: this.password
    };

    this.authService.login(loginData).subscribe(
      (response: AuthResponse) => {
        if (response.resultado) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(LOCAL_STORAGE.Token, response.token!);  
            localStorage.setItem(LOCAL_STORAGE.Refreshtoken, response.refreshToken!);
            localStorage.setItem(LOCAL_STORAGE.Expiration, response.expiration!);
          }
          this.router.navigate(['/main']);
        } else {
          console.error('Error:', response.msg);
          alert('Login failed: ' + response.msg);
        }
      },
      error => {
        console.error('Login error', error);
        alert('Login error: ' + error.message);
      }
    );
  }
}
