import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SchoolHistoryPage } from './school-history.page';

const routes: Routes = [
  {
    path: '',
    component: SchoolHistoryPage,
    pathMatch: 'full',
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./history-detail/history-detail.module').then(
        (m) => m.HistoryDetailPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SchoolHistoryPageRoutingModule {}
