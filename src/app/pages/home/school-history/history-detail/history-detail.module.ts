import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryDetailPageRoutingModule } from './history-detail-routing.module';

import { HistoryDetailPage } from './history-detail.page';
import { SharedComponentsModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryDetailPageRoutingModule,
    SharedComponentsModule,
  ],
  declarations: [HistoryDetailPage],
})
export class HistoryDetailPageModule {}
