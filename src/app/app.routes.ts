import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: '', loadComponent: () => import('./home/home').then((m) => m.Home)
    },
    {
        path: 'sound', loadComponent: () => import('./play-sound/play-sound').then((m) => m.PlaySound)
    },
    {
        path: 'star', loadComponent: () => import('./kids-star-game/kids-star-game').then((m) => m.KidsStarGame)
    },
    {
        path: 'color', loadComponent: () => import('./kids-color-game/kids-color-game').then((m) => m.KidsColorGame)
    }
];
