import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DownloadPageRoutingModule } from './download-routing.module';

import { DownloadPage } from './download.page';
import { SharedComponentsModule } from 'src/app/shared/shared.module';
import { DownloadItemComponent } from './download-item/download-item.component';
import { NoteIconPathPipe } from 'src/app/shared/pipes/note-icon-path.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, DownloadPageRoutingModule, SharedComponentsModule],
  declarations: [DownloadPage, DownloadItemComponent],
  providers: [NoteIconPathPipe],
})
export class DownloadPageModule {}
