import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LibraryPageRoutingModule } from './library-routing.module';

import { LibraryPage } from './library.page';
import { SharedComponentsModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, LibraryPageRoutingModule, SharedComponentsModule],
  declarations: [LibraryPage],
})
export class LibraryPageModule {}
