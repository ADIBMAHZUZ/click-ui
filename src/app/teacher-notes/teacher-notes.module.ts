import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeacherNotesPageRoutingModule } from './teacher-notes-routing.module';

import { SharedComponentsModule } from 'src/app/shared/shared.module';
import { ViewNoteComponent } from './shared/components/view-note/view-note.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeacherNotesPageRoutingModule,
    SharedComponentsModule,
  ],
  declarations: [ViewNoteComponent],
})
export class TeacherNotesPageModule {}
