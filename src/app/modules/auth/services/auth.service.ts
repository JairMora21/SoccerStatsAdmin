import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../enviroment';
import { AuthResponse } from '../models/auth-response.model';
import { LoginDto } from '../dto/login.dto';
import { LOCAL_STORAGE } from '../../../shared/Constants/local-storage';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  login(data: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/Usuario/Autenticar`, data)
      .pipe(
        catchError(error => {
          console.error('Login error', error);
          return throwError(error);
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(LOCAL_STORAGE.Token);
      localStorage.removeItem(LOCAL_STORAGE.Refreshtoken);
      localStorage.removeItem(LOCAL_STORAGE.Expiration);
    }
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(LOCAL_STORAGE.Token);
      const expiration = localStorage.getItem(LOCAL_STORAGE.Expiration);
      console.log('token', token);
      console.log('expiration', expiration);

      if (!token || !expiration) {
        return false;
      }
      const expirationDate = new Date(expiration);
      return expirationDate > new Date();
    }
    return false;
  }
}
