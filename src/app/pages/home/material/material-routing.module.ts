import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialPage } from './material.page';
import { MediaType } from 'src/app/core/models';

const lazyloadListingPageModule = () =>
  import('./shared/listing/listing.module').then((m) => m.ListingPageModule);

const routes: Routes = [
  {
    path: '',
    component: MaterialPage,
    children: [
      {
        path: '',
        redirectTo: 'book',
        pathMatch: 'full',
      },
      {
        path: 'book',
        loadChildren: lazyloadListingPageModule,
        data: {
          type: MediaType.BOOK,
        },
      },
      {
        path: 'audio',
        loadChildren: lazyloadListingPageModule,
        data: {
          type: MediaType.AUDIO,
        },
      },
      {
        path: 'video',
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
export class MaterialPageRoutingModule {}
