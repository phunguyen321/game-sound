import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: '', loadComponent: () => import('./learn-animal/home/home').then((m) => m.Home)
    },
    // {
    //     path: 'sound', loadComponent: () => import('./play-sound/play-sound').then((m) => m.PlaySound)
    // },
    // {
    //     path: 'star', loadComponent: () => import('./kids-star-game/kids-star-game').then((m) => m.KidsStarGame)
    // },
    // {
    //     path: 'color', loadComponent: () => import('./kids-color-game/kids-color-game').then((m) => m.KidsColorGame)
    // },
    {
        path: 'find-animal',
        loadComponent: () => import('./learn-animal/find-animal/find-animal').then(m => m.FindAnimal)
    },
    {
        path: 'listen-speak',
        loadComponent: () => import('./learn-animal/listen-speak/listen-speak').then(m => m.ListenSpeak)
    },
    {
        path: 'touch-listen',
        loadComponent: () => import('./learn-animal/touch-listen/touch-listen').then(m => m.TouchListen)
    },
];
