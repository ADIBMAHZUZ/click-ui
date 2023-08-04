import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MediaPageRoutingModule } from './media-routing.module';

import { MediaPage } from './media.page';
import { SharedComponentsModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MediaPageRoutingModule,
    SharedComponentsModule,
  ],
  declarations: [MediaPage],
})
export class MediaPageModule {}
