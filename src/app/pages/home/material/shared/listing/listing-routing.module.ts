import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListingPage } from './listing.page';

const routes: Routes = [
  {
    path: '',
    component: ListingPage,
  },
  {
    path: 'see-all/:category',
    loadChildren: () =>
      import('../see-all/see-all.module').then((m) => m.SeeAllPageModule),
  },
  {
    path: 'detail/:id',
    loadChildren: () =>
      import('../detail/detail.module').then((m) => m.DetailPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListingPageRoutingModule {}
