import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaterialPageRoutingModule } from './material-routing.module';

import { MaterialPage } from './material.page';
import { SharedComponentsModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialPageRoutingModule,
    SharedComponentsModule,
  ],
  declarations: [MaterialPage],
})
export class MaterialPageModule {}
