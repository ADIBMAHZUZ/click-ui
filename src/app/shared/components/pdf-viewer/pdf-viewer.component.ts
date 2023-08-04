import { ElectronService } from 'ngx-electron';
import { Component, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { PdfJsViewerComponent } from 'ng2-pdfjs-viewer';
import { ModalController, Platform } from '@ionic/angular';
import { fromEvent } from 'rxjs';
import { DownloadType } from '../../download/models/download-type.model';
import { Store } from '@ngxs/store';
import { AddBookmark, RemoveBookmark } from '../../download/store/bookmark.actions';
import { SubSink } from 'subsink';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Capacitor } from '@capacitor/core';
@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css'],
})
export class PdfViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('pdfViewerAutoLoad') pdfViewerAutoLoad: PdfJsViewerComponent;
  @Input() path: string;
  @Input() bookmarks: number[] = [];
  @Input() id: string;
  @Input() downloadType: DownloadType;
  @Input() isPreview: boolean;

  private _subSink = new SubSink();
  private _defaultOrientation = '';

  constructor(
    private _modalCtrl: ModalController,
    private _store: Store,
    private _platform: Platform,
    private _screenOrientation: ScreenOrientation,
    private _electron: ElectronService
  ) {}

  ngAfterViewInit(): void {
    try {
      if (!this._electron.isElectronApp) {
        const width = this._platform.width();
        if (width > 768) {
          this._defaultOrientation = this._screenOrientation.ORIENTATIONS.LANDSCAPE;
        } else {
          this._defaultOrientation = this._screenOrientation.ORIENTATIONS.PORTRAIT;
        }
        this._screenOrientation.lock(this._defaultOrientation);
        this._screenOrientation.unlock();
      }
      this.pdfViewerAutoLoad.pdfSrc = this.path;
      this.pdfViewerAutoLoad.refresh();
    } catch (error) {
      console.warn(error);
    }
  }
  ngOnDestroy(): void {
    this._subSink.unsubscribe();
    if (!this._electron.isElectronApp) {
      this._screenOrientation.lock(this._defaultOrientation);
    }
  }
  close() {
    this._modalCtrl.dismiss();
  }
  handlePageChange(pageIndex) {
    const pdfViewApp = this.pdfViewerAutoLoad.PDFViewerApplication;

    const pdfViewMainContainer = pdfViewApp.appConfig.mainContainer;
    this._disableHref(pdfViewMainContainer);

    if (this.isPreview) {
      return;
    }
    const btnViewBookmarkNavbar = pdfViewApp.toolbar.items.viewBookmark;
    const pdfViewBody = pdfViewApp.appConfig.appContainer;
    const bookmarksView: HTMLDivElement = pdfViewBody.querySelector('#bookmarksView');
    this.bookmarks.forEach((index) => {
      bookmarksView.querySelector(`#page${index} .thumbnail`).classList.remove('selected');
    });
    if (this.bookmarks.includes(pageIndex)) {
      btnViewBookmarkNavbar.classList.add('active');
      bookmarksView.querySelector(`#page${pageIndex} .thumbnail`).classList.add('selected');
    } else {
      btnViewBookmarkNavbar.classList.remove('active');
    }
  }
  handleDocumentLoad() {
    const pdfViewApp = this.pdfViewerAutoLoad.PDFViewerApplication;
    const pdfViewBody = pdfViewApp.appConfig.appContainer;
    const pdfViewMainContainer = pdfViewApp.appConfig.mainContainer;
    this._disableHref(pdfViewMainContainer);

    if (this.isPreview) {
      return;
    }

    const btnViewBookmarkNavbar = pdfViewApp.toolbar.items.viewBookmark;
    const btnViewBookmarkSidebar = pdfViewBody.querySelector('#viewBookmarks');
    const btnViewOutlineSidebar = pdfViewBody.querySelector('#viewOutline');
    const btnViewAttachmentsSidebar = pdfViewBody.querySelector('#viewAttachments');
    const btnViewThumbnailSidebar = pdfViewBody.querySelector('#viewThumbnail');
    const btnOutlineView: HTMLDivElement = pdfViewBody.querySelector('#outlineView');
    const btnAttachmentsView: HTMLDivElement = pdfViewBody.querySelector('#attachmentsView');
    const btnThumbnailView: HTMLDivElement = pdfViewBody.querySelector('#thumbnailView');
    const bookmarksView: HTMLDivElement = pdfViewBody.querySelector('#bookmarksView');
    bookmarksView.style.display = 'flex';
    bookmarksView.style.flexWrap = 'wrap';
    bookmarksView.style.justifyContent = 'center';

    const updateTemplate = () => {
      let template = '';
      if (this.bookmarks.length > 0) {
        bookmarksView.innerHTML = '';
        this.bookmarks.forEach((pageIndex) => {
          const page = this._getCurrentPage(pdfViewApp, pageIndex);

          const wrap = document.createElement('div');
          const node = page.cloneNode(true);
          node.id = `page${pageIndex}`;
          wrap.appendChild(node);
          template += wrap.innerHTML;
        });
      } else {
        template = '<div class="outlineItem" style="color: #dedede; padding: 5px;">Add bookmark for easy to find.</div>';
      }
      bookmarksView.innerHTML = template;
    };
    this._subSink.sink = fromEvent(btnViewOutlineSidebar, 'click').subscribe(() => {
      bookmarksView.classList.add('hidden');
      btnViewBookmarkSidebar.classList.remove('toggled');
    });
    this._subSink.sink = fromEvent(btnViewAttachmentsSidebar, 'click').subscribe(() => {
      bookmarksView.classList.add('hidden');
      btnViewBookmarkSidebar.classList.remove('toggled');
    });
    this._subSink.sink = fromEvent(btnViewThumbnailSidebar, 'click').subscribe(() => {
      bookmarksView.classList.add('hidden');
      btnViewBookmarkSidebar.classList.remove('toggled');
    });
    this._subSink.sink = fromEvent(btnViewBookmarkSidebar, 'click').subscribe(() => {
      btnOutlineView.classList.add('hidden');
      btnAttachmentsView.classList.add('hidden');
      btnThumbnailView.classList.add('hidden');
      btnViewOutlineSidebar.classList.remove('toggled');
      btnViewAttachmentsSidebar.classList.remove('toggled');
      btnViewThumbnailSidebar.classList.remove('toggled');
      btnViewBookmarkSidebar.classList.add('toggled');
      bookmarksView.classList.remove('hidden');
      updateTemplate();
    });
    this._subSink.sink = fromEvent(btnViewBookmarkNavbar, 'click').subscribe(() => {
      const pageIndex = this.pdfViewerAutoLoad.page;

      if (this.bookmarks.includes(pageIndex)) {
        this.bookmarks = this.bookmarks.filter((page) => page !== pageIndex);
        this._store.dispatch(
          new RemoveBookmark({
            id: this.id,
            downloadType: this.downloadType,
            pageIndex,
          })
        );
        btnViewBookmarkNavbar.classList.remove('active');
      } else {
        this.bookmarks = [...this.bookmarks, pageIndex];
        this._store.dispatch(
          new AddBookmark({
            id: this.id,
            downloadType: this.downloadType,
            pageIndex,
          })
        );
        btnViewBookmarkNavbar.classList.add('active');
      }
      updateTemplate();
    });
    updateTemplate();
  }
  private _getCurrentPage(pdfViewApp, pageIndex) {
    return pdfViewApp.appConfig.sidebar.thumbnailView.children[pageIndex - 1];
  }
  private _disableHref(pdfViewMainContainer) {
    const anchors: NodeList = pdfViewMainContainer.querySelectorAll('a:not([href^="#"])');
    anchors.forEach((anchor: HTMLAnchorElement) => {
      if (!anchor.onclick) {
        anchor.onclick = function () {
          return false;
        };
      }
    });
  }
}
