import { Routes } from '@angular/router';
import { HomeScreen } from './home-screen/home-screen';
import { Challenges } from './challenges/challenges';
import { ChallengeCompleted } from './challenge-completed/challenge-completed';
import { ChallengeFailed } from './challenge-failed/challenge-failed';
import { ChallengesCopy } from './challenges-copy/challenges-copy';

export const routes: Routes = [

    { path: '', redirectTo: '/home', pathMatch: 'full' }, 

    { path: 'home', component: HomeScreen },
    { path: 'challenges', component: Challenges },
    { path: 'challenges-copy', component: ChallengesCopy },
    { path: 'win', component: ChallengeCompleted },
    { path: 'lost', component: ChallengeFailed },

];
