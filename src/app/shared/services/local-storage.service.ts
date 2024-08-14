import { Injectable } from '@angular/core';
import { LOCAL_STORAGE } from '../Constants/local-storage';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }


  // TeamId: 'teamId',
  getTeamId(): string {
    return localStorage.getItem(LOCAL_STORAGE.TeamId) || '';
  }
  setTeamId(teamId: string): void {
    localStorage.setItem(LOCAL_STORAGE.TeamId, teamId);
  }

  // TeamBadge: 'teamBadge',
  getTeamBadge(): string {
    return localStorage.getItem(LOCAL_STORAGE.TeamBadge) || '';
  }
  setTeamBadge(teamBadge: string): void {
    localStorage.setItem(LOCAL_STORAGE.TeamBadge, teamBadge);
  }

  // TeamName: 'teamName',
  getTeamName(): string {
    return localStorage.getItem(LOCAL_STORAGE.TeamName) || '';
  }

  setTeamName(teamName: string): void {
    localStorage.setItem(LOCAL_STORAGE.TeamName, teamName);
  }

  // Expiration: 'expiration',
  getExpiration(): string {
    return localStorage.getItem(LOCAL_STORAGE.Expiration) || '';
  }
  setExpiration(expiration: string): void {
    localStorage.setItem(LOCAL_STORAGE.Expiration, expiration);
  }

  // Refres
  getRefreshtoken(): string {
    return localStorage.getItem(LOCAL_STORAGE.Refreshtoken) || '';
  }
  setRefreshtoken(refreshtoken: string): void {
    localStorage.setItem(LOCAL_STORAGE.Refreshtoken, refreshtoken);
  }

  // Token: 'auth'
  getToken(): string {
    return localStorage.getItem(LOCAL_STORAGE.Token) || '';
  }
  setToken(token: string): void {
    localStorage.setItem(LOCAL_STORAGE.Token, token);
  }


  // Generic methods
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
