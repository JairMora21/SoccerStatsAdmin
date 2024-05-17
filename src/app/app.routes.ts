import { Routes } from '@angular/router';
import { AuthComponent } from './modules/auth/auth.component';
import { PlayersComponent } from './modules/players/players.component';
import { authGuard } from './core/guard/auth.guard';
import { TeamComponent } from './modules/team/team.component';
import { SeasonsComponent } from './modules/seasons/seasons.component';

export const routes: Routes = [
  {
    path: 'login',
    component: AuthComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'players',
    component: PlayersComponent,
    canActivate: [authGuard] 
  },
  {
    path: 'team',
    component: TeamComponent,
    canActivate: [authGuard] 
  },
  {
    path: 'seasons',
    component: SeasonsComponent,
    canActivate: [authGuard] 
  }
];
