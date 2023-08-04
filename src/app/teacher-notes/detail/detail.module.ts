import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailPageRoutingModule } from './detail-routing.module';

import { DetailPage } from './detail.page';
import { SharedComponentsModule } from 'src/app/shared/shared.module';
import { FileCardComponent } from '../shared/components/file-card/file-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailPageRoutingModule,
    SharedComponentsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [DetailPage, FileCardComponent],
})
export class DetailPageModule {}
