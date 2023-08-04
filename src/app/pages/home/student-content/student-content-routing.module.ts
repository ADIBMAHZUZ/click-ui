import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudentContentPage } from './student-content.page';

const routes: Routes = [
  {
    path: '',
    component: StudentContentPage
  },
  {
    path: ':id',
    loadChildren: () => import('./detail/content-detail.module').then( m => m.DetailPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentContentPageRoutingModule {}
