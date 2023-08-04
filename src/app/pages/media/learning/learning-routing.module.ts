import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MediaType } from 'src/app/core/models';
import { LearningPage } from './learning.page';

const lazyloadListingPageModule = () =>
  import('../../home/material/shared/listing/listing.module').then(
    (m) => m.ListingPageModule
  );

const routes: Routes = [
  {
    path: '',
    component: LearningPage,
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
          downloaded: true,
        },
      },
      {
        path: MediaType.AUDIO,
        loadChildren: lazyloadListingPageModule,
        data: {
          type: MediaType.AUDIO,
          downloaded: true,
        },
      },
      {
        path: MediaType.VIDEO,
        loadChildren: lazyloadListingPageModule,
        data: {
          type: MediaType.VIDEO,
          downloaded: true,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LearningPageRoutingModule {}
