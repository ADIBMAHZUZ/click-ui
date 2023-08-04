import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DownloadModule } from './download/download.module';
import { AudioViewComponent, VideoViewComponent, LanguageChooserComponent, HeaderComponent } from './components';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';
import { CategoryListingComponent } from './components/category-listing/category-listing.component';
import { CategoryListingSkeletonComponent } from './components/category-listing-skeleton/category-listing-skeleton.component';
import { NoteIconPathPipe } from './pipes/note-icon-path.pipe';
import { DownloadingPercentPipe } from './pipes/downloading-percent.pipe';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    DownloadModule,
    PdfJsViewerModule,
  ],
  declarations: [
    HeaderComponent,
    VideoViewComponent,
    AudioViewComponent,
    LanguageChooserComponent,
    PdfViewerComponent,
    CategoryListingComponent,
    CategoryListingSkeletonComponent,
    NoteIconPathPipe,
    DownloadingPercentPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    HeaderComponent,
    RouterModule,
    TranslateModule,
    VideoViewComponent,
    AudioViewComponent,
    LanguageChooserComponent,
    PdfViewerComponent,
    CategoryListingComponent,
    CategoryListingSkeletonComponent,
    NoteIconPathPipe,
    DownloadingPercentPipe,
  ],
})
export class SharedComponentsModule {}
