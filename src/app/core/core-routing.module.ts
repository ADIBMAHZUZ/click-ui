import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CorePage } from './core.page';
import { NetworkGuard } from './guards/network.guard';
import { IsLoggedInGuard } from '../auth/shared/guards/is-logged-in.guard';
import { IsNotLoggedInGuard } from '../auth/shared/guards/is-not-logged-in.guard';
import { OfflineHomeGuard } from './guards/offline-home.guard';
import { ProfileComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: CorePage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../pages/home/home.module').then((m) => m.HomePageModule),
        canActivateChild: [OfflineHomeGuard, IsLoggedInGuard],
      },
      {
        path: 'media',
        loadChildren: () =>
          import('../pages/media/media.module').then((m) => m.MediaPageModule),
        canActivateChild: [IsLoggedInGuard],
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../dashboard/dashboard.module').then(
            (m) => m.DashboardPageModule
          ),
        canActivateChild: [NetworkGuard, IsLoggedInGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivateChild: [OfflineHomeGuard, IsLoggedInGuard],
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
    ],
  },
  {
    path: 'login',
    loadChildren: () => import('../auth/auth.module').then((m) => m.AuthModule),
    canActivate: [IsNotLoggedInGuard],
  },

  { path: '', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CorePageRoutingModule {}
