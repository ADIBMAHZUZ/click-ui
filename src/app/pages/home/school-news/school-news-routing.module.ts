import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SchoolNewsPage } from './school-news.page';

const routes: Routes = [
  {
    path: '',
    component: SchoolNewsPage,
    pathMatch: 'full',
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./news-detail/news-detail.module').then(
        (m) => m.NewsDetailPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SchoolNewsPageRoutingModule {}
