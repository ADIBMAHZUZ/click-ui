import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishlistPage } from './wishlist.page';

const lazyloadDetailPage = () =>
  import('src/app/pages/home/library/detail/detail.module').then(
    (m) => m.DetailPageModule
  );

const routes: Routes = [
  {
    path: '',
    component: WishlistPage,
    pathMatch: 'full',
  },
  {
    path: 'book/:id',
    loadChildren: lazyloadDetailPage,
  },
  {
    path: 'audio/:id',
    loadChildren: lazyloadDetailPage,
  },
  {
    path: 'video/:id',
    loadChildren: lazyloadDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishlistPageRoutingModule {}
