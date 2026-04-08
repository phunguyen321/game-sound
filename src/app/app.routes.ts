import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'sound',
        pathMatch: 'full'
    },
    {
        path: 'sound', loadComponent: () => import('./play-sound/play-sound').then((m) => m.PlaySound)
    }
];
