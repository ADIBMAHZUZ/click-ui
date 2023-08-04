import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudentContentPageRoutingModule } from './student-content-routing.module';

import { StudentContentPage } from './student-content.page';
import { SharedComponentsModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudentContentPageRoutingModule,
    SharedComponentsModule,
  ],
  declarations: [StudentContentPage],
})
export class StudentContentPageModule {}
