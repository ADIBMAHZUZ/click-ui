import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewsDetailPageRoutingModule } from './news-detail-routing.module';

import { NewsDetailPage } from './news-detail.page';
import { SharedComponentsModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewsDetailPageRoutingModule,
    SharedComponentsModule,
  ],
  declarations: [NewsDetailPage],
})
export class NewsDetailPageModule {}
