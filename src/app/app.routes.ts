import { Routes } from '@angular/router';
import { AuthComponent } from './modules/auth/auth.component';
import { authGuard } from './core/guard/auth.guard';
import { TeamComponent } from './modules/team/team.component';
import { SeasonsComponent } from './modules/seasons/seasons.component';
import { InicioComponent } from './modules/inicio/inicio.component';
import { MatchesComponent } from './modules/matches/matches.component';

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
    path: 'main',
    component: InicioComponent,
    canActivate: [authGuard] 
  },
  {
    path: 'matches',
    component: MatchesComponent,
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
