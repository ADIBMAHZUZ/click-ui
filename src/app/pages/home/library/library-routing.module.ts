import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LibraryPage } from './library.page';
import { MediaType } from 'src/app/core/models';

const lazyloadListingPageModule = () =>
  import('./listing/listing.module').then((m) => m.ListingPageModule);

const routes: Routes = [
  {
    path: '',
    component: LibraryPage,
    children: [
      {
        path: '',
        redirectTo: MediaType.BOOK,
        pathMatch: 'full',
      },
      {
        path: MediaType.BOOK,
        loadChildren: lazyloadListingPageModule,
        data: {
          type: MediaType.BOOK,
        },
      },
      {
        path: MediaType.AUDIO,
        loadChildren: lazyloadListingPageModule,
        data: {
          type: MediaType.AUDIO,
        },
      },
      {
        path: MediaType.VIDEO,
        loadChildren: lazyloadListingPageModule,
        data: {
          type: MediaType.VIDEO,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibraryPageRoutingModule {}
