import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../enviroment';
import { AuthResponse } from '../models/auth-response.model';
import { LoginDto } from '../dto/login.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(data: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/Usuario/Autenticar`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    if (!token || !expiration) {
      return false;
    }
    const expirationDate = new Date(expiration);
    return expirationDate > new Date();
  }
}
