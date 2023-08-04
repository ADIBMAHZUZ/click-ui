import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    pathMatch: 'full',
  },
  {
    path: 'library',
    loadChildren: () =>
      import('./library/library.module').then((m) => m.LibraryPageModule),
  },

  {
    path: 'school-news',
    loadChildren: () =>
      import('./school-news/school-news.module').then(
        (m) => m.SchoolNewsPageModule
      ),
  },
  {
    path: 'school-history',
    loadChildren: () =>
      import('./school-history/school-history.module').then(
        (m) => m.SchoolHistoryPageModule
      ),
  },
  {
    path: 'material',
    loadChildren: () =>
      import('./material/material.module').then((m) => m.MaterialPageModule),
  },
  {
    path: 'teacher-notes',
    loadChildren: () =>
      import('../../teacher-notes/teacher-notes.module').then(
        (m) => m.TeacherNotesPageModule
      ),
  },
  {
    path: 'student-content',
    loadChildren: () =>
      import('./student-content/student-content.module').then(
        (m) => m.StudentContentPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
