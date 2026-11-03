import { Routes } from '@angular/router';
import { HomeScreen } from './home-screen/home-screen';
import { ChallengesWorld1 } from './challenges-world-1/challenges-world-1';
import { Mundo } from './mundo/mundo';
import { MundoDesafios } from './mundo-desafios/mundo-desafios';
import { InventarioComponent } from './inventario/inventario';
import { Mundo6DesafioScreen } from './mundo6-desafio-screen/mundo6-desafio-screen';
import { Recompensas } from './recompensa-screen/recompensa-screen';

export const routes: Routes = [

    { path: '', redirectTo: '/home', pathMatch: 'full' }, 

    { path: 'home', component: HomeScreen },
    { path: 'mundos', component: Mundo},
    { path: 'desafios/capitulo/:id', component: MundoDesafios},
    { path: 'mundo/capitulo/:id', component: MundoDesafios},
    { path: 'desafios/:id', component: ChallengesWorld1},
    { path: 'capitulo/6/:id', component: Mundo6DesafioScreen },
    { path: 'inventario', component: InventarioComponent },
    { path: 'win', component: Recompensas}
];
