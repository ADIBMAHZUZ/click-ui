import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MediaPage } from './media.page';
import { NetworkGuard } from 'src/app/core/guards/network.guard';

const routes: Routes = [
  {
    path: '',
    component: MediaPage,
    children: [
      {
        path: '',
        redirectTo: 'library',
        pathMatch: 'full',
      },
      {
        path: 'download',
        loadChildren: () =>
          import('./download/download.module').then(
            (m) => m.DownloadPageModule
          ),
        canActivateChild: [NetworkGuard],
      },
      {
        path: 'material',
        loadChildren: () =>
          import('./learning/learning.module').then(
            (m) => m.LearningPageModule
          ),
      },
      {
        path: 'teacher-notes',
        loadChildren: () =>
          import('./teacher-notes/teacher-notes.module').then(
            (m) => m.TeacherNotesPageModule
          ),
        data: {
          downloaded: true,
        },
      },
      {
        path: 'library',
        loadChildren: () =>
          import('./library/library.module').then((m) => m.LibraryPageModule),
        data: {
          downloaded: true,
        },
      },
      {
        path: 'media-wishlist',
        loadChildren: () =>
          import('./wishlist/wishlist.module').then(
            (m) => m.WishlistPageModule
          ),
        canActivateChild: [NetworkGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MediaPageRoutingModule {}
