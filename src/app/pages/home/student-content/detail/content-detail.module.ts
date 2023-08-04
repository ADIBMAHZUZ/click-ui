import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContentDetailPageRoutingModule } from './content-detail-routing.module';

import { ContentDetailPage } from './content-detail.page';
import { SharedComponentsModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContentDetailPageRoutingModule,
    SharedComponentsModule,
  ],
  declarations: [ContentDetailPage],
})
export class DetailPageModule {}
