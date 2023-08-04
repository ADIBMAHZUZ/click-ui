import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LearningPageRoutingModule } from './learning-routing.module';

import { LearningPage } from './learning.page';
import { SharedComponentsModule } from 'src/app/shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LearningPageRoutingModule,
    SharedComponentsModule,
  ],
  declarations: [LearningPage],
})
export class LearningPageModule {}
