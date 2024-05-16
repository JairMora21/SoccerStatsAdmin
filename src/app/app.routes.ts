import { Routes } from '@angular/router';
import { AuthComponent } from './modules/auth/auth.component';
import { PlayersComponent } from './modules/players/players.component';
import { TeamComponent } from './modules/team/team.component';

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
    },
    {
        path: 'team',
        component: TeamComponent
    }

];
