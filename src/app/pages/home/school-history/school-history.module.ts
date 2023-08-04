import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SchoolHistoryPageRoutingModule } from './school-history-routing.module';

import { SchoolHistoryPage } from './school-history.page';
import { SharedComponentsModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SchoolHistoryPageRoutingModule,
    SharedComponentsModule,
  ],
  declarations: [SchoolHistoryPage],
})
export class SchoolHistoryPageModule {}
