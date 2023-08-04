import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LibraryPage } from './library.page';
import { MediaType } from 'src/app/core/models';

const routes: Routes = [
  {
    path: '',
    component: LibraryPage,
    children: [
      {
        path: MediaType.BOOK,
        loadChildren: () =>
          import('../../home/library/listing/listing.module').then(
            (m) => m.ListingPageModule
          ),
        data: {
          type: MediaType.BOOK,
          downloaded: true,
        },
      },
      {
        path: MediaType.AUDIO,
        loadChildren: () =>
          import('../../home/library/listing/listing.module').then(
            (m) => m.ListingPageModule
          ),
        data: {
          type: MediaType.AUDIO,
          downloaded: true,
        },
      },
      {
        path: MediaType.VIDEO,
        loadChildren: () =>
          import('../../home/library/listing/listing.module').then(
            (m) => m.ListingPageModule
          ),
        data: {
          type: MediaType.VIDEO,
          downloaded: true,
        },
      },
      {
        path: '',
        redirectTo: MediaType.BOOK,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibraryPageRoutingModule {}
