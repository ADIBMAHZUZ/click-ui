import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./teachers/teachers.module').then((m) => m.TeachersPageModule),
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./detail/detail.module').then((m) => m.DetailPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherNotesPageRoutingModule {}
