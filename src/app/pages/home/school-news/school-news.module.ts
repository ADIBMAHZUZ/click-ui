import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SchoolNewsPageRoutingModule } from './school-news-routing.module';

import { SchoolNewsPage } from './school-news.page';
import { SharedComponentsModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SchoolNewsPageRoutingModule,
    SharedComponentsModule,
  ],
  declarations: [SchoolNewsPage],
})
export class SchoolNewsPageModule {}
