import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, withLatestFrom } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { Store, Select, ofActionCompleted, Actions, ofActionSuccessful } from '@ngxs/store';
import { IonInfiniteScroll, ModalController, Platform, AlertController, IonContent } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Market } from '@ionic-native/market/ngx';
import { Capacitor } from '@capacitor/core';

import { getDistanceFromTop } from 'src/app/shared/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { MediaMusicService, NetworkService } from 'src/app/core/services';
import { UtilsService } from '../shared/services';
import { ViewNoteComponent } from '../shared/components/view-note/view-note.component';
import { DownloadingService } from '../shared/services/downloading.service';
import {
  TeacherNotesState,
  LoadSelectedTeacherNotesNext,
  LoadSelectedTeacherNotesOffline,
  LoadSelectedTeacherNotes,
  ResetSelectedNotes,
  TeacherNotesView,
  TeacherNoteDetailType,
  mimeTypeMapper,
  googlePlayMapper,
  appStoreMapper,
  TeacherNoteViewType,
  TEACHER_NOTES_ENDPOINTS,
} from '../shared';
import { TranslateService } from '@ngx-translate/core';
import { DownloadTeacherNoteStateModel } from '../store/teacher-notes-state.model';
import { AudioViewComponent, VideoViewComponent, PdfViewerComponent } from 'src/app/shared/components';
import { ResetSearchQuery, CoreState, AddOfflineRequest } from 'src/app/core/store';
import { RemoveItem } from 'src/app/shared/download/store/download.actions';
import { DownloadType } from 'src/app/shared/download/models/download-type.model';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage {
  @Select(CoreState.getSearchQuery) query$: Observable<string>;
  @Select(TeacherNotesState.getSelectedTeacherNotes) states$: Observable<TeacherNotesView>;

  @ViewChild(IonInfiniteScroll) private _infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) private _ionContent: IonContent;
  @ViewChildren('item') private _items: QueryList<any>;

  private _alertsTranslation: any;
  private _currentUrl = '';
  private _historyStack = [];
  private _mediaTypeFunctionsMap = {
    pdf: { view: (subject) => this._viewPDF(subject) },
    mp3: { view: (subject) => this._viewMP3(subject.value) },
    mp4: { view: (subject) => this._viewMP4(subject.value) },
    txt: { view: (subject) => this._viewTXT(subject.value) },
  };
  private _preLoadmoreUrl = '';
  private _subSink = new SubSink();

  isCustomHeaderBack = false;
  teacher: TeacherNotesView;

  constructor(
    private _route: ActivatedRoute,
    private _store: Store,
    private _router: Router,
    private _modalCtrl: ModalController,
    private _platform: Platform,
    private _utilsService: UtilsService,
    private _mediaMusicService: MediaMusicService,
    private _alertCtrl: AlertController,
    private _downloadingService: DownloadingService,
    private _translateService: TranslateService,
    private _networkService: NetworkService,
    private _fileOpener: FileOpener,
    private _market: Market,
    private _actions: Actions,
    private _electron: ElectronService
  ) {
    this._historyStack = [];
  }

  ionViewDidEnter() {
    this._registerRemoveItemSuccessful();
    this._store.dispatch([new ResetSearchQuery(), new ResetSelectedNotes()]);
    this._translateService.get('TEACHER_NOTES.DETAIL.ALERTS').subscribe((alerts) => (this._alertsTranslation = alerts));
    this._subSink.sink = this._actions.pipe(ofActionCompleted(LoadSelectedTeacherNotes)).subscribe(() => {
      this._checkLoadmore();
    });
    this._subSink.sink = this.query$
      .pipe(
        withLatestFrom(this._route.params, this._route.data),
        tap(([query, { id }, { downloaded: isInMyMedia }]) => {
          if (isInMyMedia) {
            this._store.dispatch(new LoadSelectedTeacherNotesOffline({ id, query }));
            return;
          }
          if (!this._historyStack.includes('action')) {
            this._historyStack.push('action');
          }
          this._store.dispatch(new LoadSelectedTeacherNotes({ id, query, folderUrl: this._currentUrl }));
        })
      )
      .subscribe();
    this._subSink.sink = this.states$.subscribe((teacher) => {
      this.teacher = teacher;
      this._preLoadmoreUrl = '';
    });
  }

  ionViewWillLeave() {
    this._subSink.unsubscribe();
  }

  loadMore() {
    const nextUrl = this.teacher?.results.notes.next;

    if (nextUrl !== null && nextUrl !== this._preLoadmoreUrl) {
      this._preLoadmoreUrl = nextUrl;

      this._store.dispatch(
        new LoadSelectedTeacherNotesNext({
          url: nextUrl,
        })
      );
    }

    this._infiniteScroll.complete();
    if (this.teacher.results.notes.results.length == this.teacher.results.notes.count) {
      this._infiniteScroll.disabled = true;
    }
  }

  async openNote(noteSubject: BehaviorSubject<DownloadTeacherNoteStateModel>) {
    const state = noteSubject.value;
    const note = state?.item;
    const isDownloading = state.downloading && state.downloading.downloadedSize !== 0;
    const isNoteInvalid = !note || !note.url;

    if (isDownloading || isNoteInvalid) {
      return;
    }
    if (note.type === TeacherNoteDetailType.folder) {
      this.openFolder(note);
      return;
    }

    if (state?.downloaded) {
      if (TeacherNoteDetailType[note.type]) {
        this.view(noteSubject);
      } else {
        const { NOTE_TYPE_IS_NOT_SUPPORTED } = this._alertsTranslation;
        const warningAlert = await this._alertCtrl.create({
          header: NOTE_TYPE_IS_NOT_SUPPORTED.title,
          message: NOTE_TYPE_IS_NOT_SUPPORTED.message,
          cssClass: 'warning-alert',
        });
        await warningAlert.present();
      }
      return;
    }
    if (!this._networkService.isConnected()) {
      const NO_INTERNET_CONNECTION = await this._translateService.get('HOME.LIBRARY.BOOK.DETAIL.ALERTS.NO_INTERNET_CONNECTION').toPromise();
      const warningInternetAlert = await this._alertCtrl.create({
        header: NO_INTERNET_CONNECTION.title,
        message: NO_INTERNET_CONNECTION.message,
        cssClass: 'warning-alert',
      });
      await warningInternetAlert.present();
      return;
    }
    const response = await this._utilsService.sendDownloadRequest(note.id).toPromise();
    if (!response.success && response.error === 'Path must be file') {
      const warningAlert = await this._alertCtrl.create({
        header: this._alertsTranslation.THIS_NOTE_IS_NOT_VALID_IT_WAS.title,
        message: this._alertsTranslation.THIS_NOTE_IS_NOT_VALID_IT_WAS.message,
        cssClass: 'warning-alert',
      });
      await warningAlert.present();
      const result = await warningAlert.dismiss();

      if (result) {
        await this._utilsService.sendRemoveRequest(note.id).toPromise();

        this._store.dispatch(new RemoveItem({ id: note.id, downloadType: DownloadType.TEACHER_NOTE }));
        const query = this._store.selectSnapshot(CoreState.getSearchQuery);
        this.reloadView(query);
      }
    }

    const isDownloadSuccess = await this._utilsService.download(noteSubject).toPromise();

    if (isDownloadSuccess) {
      const currentQuery = this._store.selectSnapshot(CoreState.getSearchQuery);
      this.reloadView(currentQuery);
      const successAlert = await this._alertCtrl.create({
        header: this._alertsTranslation.DOWNLOADED_SUCCESSFULLY.title,
        message: this._alertsTranslation.DOWNLOADED_SUCCESSFULLY.title,
        cssClass: 'success-alert',
      });
      await successAlert.present();
      return;
    }
    const dangerAlert = await this._alertCtrl.create({
      header: this._alertsTranslation.DOWNLOADED_FAILED.title,
      message: this._alertsTranslation.DOWNLOADED_FAILED.title,
      cssClass: 'danger-alert',
    });
    await dangerAlert.present();
  }

  async remove(noteSubject: BehaviorSubject<DownloadTeacherNoteStateModel>) {
    if (!noteSubject) {
      return;
    }
    const state = noteSubject.value;

    const translation = await this._translateService.get('MATERIAL.DETAIL.ALERTS.DO_YOU_WANT_TO_DELETE_THIS').toPromise();
    const warningAlert = await this._alertCtrl.create({
      header: translation.do_you_want_to_delete_this,
      message: `${state.item.name}`,
      cssClass: 'warning-alert',
      buttons: [
        {
          text: translation.ok,
          handler: () => {
            warningAlert.dismiss(true);
            return false;
          },
        },
        {
          text: translation.cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            warningAlert.dismiss(false);
            return false;
          },
        },
      ],
    });
    await warningAlert.present();

    const result = await warningAlert.onDidDismiss();

    if (!result.data) {
      return;
    }
    const { id } = state.item;
    await this._store.dispatch(new RemoveItem({ id, downloadType: DownloadType.TEACHER_NOTE })).toPromise();
    const query = this._store.selectSnapshot(CoreState.getSearchQuery);
    this.reloadView(query);
    const successAlert = await this._alertCtrl.create({
      header: this._alertsTranslation.REMOVE_SUCCESSFULLY.title,
      message: this._alertsTranslation.REMOVE_SUCCESSFULLY.message,
      cssClass: 'success-alert',
    });
    await successAlert.present();

    if (!this._networkService.isConnected()) {
      this._store.dispatch(
        new AddOfflineRequest({
          request: {
            method: 'post',
            url: TEACHER_NOTES_ENDPOINTS.teacherNotesRemove.replace(':id', id),
          },
        })
      );
      return;
    }
    try {
      await this._utilsService.sendRemoveRequest(id).toPromise();
    } catch (error) {
      console.warn(error);
    }
  }

  toBehaviorSubject(noteState: DownloadTeacherNoteStateModel): BehaviorSubject<DownloadTeacherNoteStateModel> {
    const subject = this._downloadingService.getSubject(DownloadType.TEACHER_NOTE, noteState.item.id);
    return subject ?? new BehaviorSubject(noteState);
  }

  view(subject: BehaviorSubject<DownloadTeacherNoteStateModel>) {
    const note = subject.value;
    const mimeType = mimeTypeMapper[note.item.type];

    const { directory, name } = note.path;
    let url = `${directory}${name}`;
    if (this._electron.isElectronApp) {
      this._electron.shell.openExternal(`file://${url}`);
      return;
    }

    if (mimeType) {
      if (this._platform.is('android')) {
        this._fileOpener.open(url, mimeType).catch((e) => {
          console.warn('Error opening file', e);
          this._market.open(googlePlayMapper[note.item.type]);
        });
      } else if (this._platform.is('ios')) {
        this._fileOpener.open(url, mimeType).catch((e) => {
          console.warn(url);
          console.warn('Error opening file', e);
          this._market.open(appStoreMapper[note.item.type]);
        });
      }
    } else {
      this._mediaTypeFunctionsMap[note.item.type].view(subject);
    }
  }

  private _getNameFromUrl(url: string): string {
    return url.substring(url.lastIndexOf('/') + 1);
  }

  private async _viewMP3(note: DownloadTeacherNoteStateModel) {
    const { directory, name } = note.path;
    let url = `${directory}${name}`;
    if (this._platform.is('ios')) {
      url = url.replace(/^file:\/\//, '');
    }
    if (this._mediaMusicService.isPlaying()) {
      this._mediaMusicService.stop();
    }
    this._mediaMusicService.setTitle(note.item.name);
    this._mediaMusicService.setMediaInformation(null, url);
    this._mediaMusicService.reload();
    const modal = await this._modalCtrl.create({
      component: AudioViewComponent,
      swipeToClose: true,
      cssClass: 'my-custom-modal-css',
    });
    await modal.present();
    this._mediaMusicService.play();
  }

  private async _viewMP4(note: DownloadTeacherNoteStateModel): Promise<void> {
    const { directory, name } = note.path;
    let url = `${directory}${name}`;
    if (this._platform.is('ios')) {
      url = url.replace(/^file:\/\//, '');
    }
    this._mediaMusicService.stop();
    const modal = await this._modalCtrl.create({
      component: VideoViewComponent,
      swipeToClose: true,
      cssClass: 'small-modal',
      componentProps: {
        path: url,
      },
    });
    await modal.present();
  }

  private async _viewPDF(subject: BehaviorSubject<DownloadTeacherNoteStateModel>) {
    try {
      const note = subject.value;
      const { directory, name } = note.path;

      const modal = await this._modalCtrl.create({
        component: PdfViewerComponent,
        cssClass: 'modal-fullscreen',
        componentProps: {
          path: Capacitor.convertFileSrc(directory + name),
          bookmarks: note.bookmarks,
          id: note.item.id,
          downloadType: DownloadType.TEACHER_NOTE,
        },
      });
      await modal.present();
      modal.onDidDismiss().then(() => {
        const updatedNote = this._store.selectSnapshot(TeacherNotesState.getNoteById({ id: note.item.id }));
        subject.next(updatedNote);
      });
    } catch (error) {
      const { VIEW_FAILED } = await this._translateService.get('HOME.LIBRARY.BOOK.DETAIL.ALERTS').toPromise();
      const dangerAlert = await this._alertCtrl.create({
        header: VIEW_FAILED.view_failed,
        message: VIEW_FAILED.view_is_not_available_please,
        cssClass: 'danger-alert',
      });
      await dangerAlert.present();
    }
  }

  private async _viewTXT(note: DownloadTeacherNoteStateModel): Promise<void> {
    const { directory, name } = note.path;
    const content = await this._utilsService.getContentNote(Capacitor.convertFileSrc(directory + name));
    const modal = await this._modalCtrl.create({
      component: ViewNoteComponent,
      componentProps: {
        title: note.item.name,
        content: content,
      },
    });
    await modal.present();
  }

  back() {
    this._store.dispatch(new ResetSearchQuery());
    const prev = this._historyStack.pop();
    if (prev === 'action' && this._historyStack.length === 0 && !this._currentUrl) {
      this._router.navigate(['/home/teacher-notes/']);
      this.isCustomHeaderBack = false;
      return;
    }
    this._currentUrl = prev;
    if (this._historyStack.length === 0) {
      this._store.dispatch(new LoadSelectedTeacherNotes({ id: this.teacher.results.teacher.id, query: '' }));
      this._historyStack.push('action');
      this._currentUrl = '';
      return;
    }
    this._store.dispatch(new LoadSelectedTeacherNotes({ id: this.teacher.results.teacher.id, query: '', folderUrl: prev }));
  }

  private _checkLoadmore() {
    this._infiniteScroll.disabled = false;
    setTimeout(() => {
      const lastItem = this._items.last?.el;
      if (lastItem) {
        const willLoadMore = getDistanceFromTop(lastItem) + lastItem?.offsetHeight < window?.innerHeight * 0.9;
        if (willLoadMore) {
          this.loadMore();
        }
      }
    }, 1000);
  }

  getTitle(): string {
    const teacherName = this.teacher?.results.teacher.name;
    const breadcrumbs = this._historyStack.filter((_, i) => i > 0).map(this._getNameFromUrl);
    let title = '';
    if (breadcrumbs.length === 0) {
      title = teacherName?.concat(this._currentUrl ? ' > ' + this._getNameFromUrl(this._currentUrl) : '');
    } else {
      title = teacherName?.concat(' > ', breadcrumbs.join(' > '), ' > ', this._getNameFromUrl(this._currentUrl));
    }
    if (title?.length > 80) {
      title = teacherName?.concat(' > ... > ', this._getNameFromUrl(this._currentUrl));
    }
    return title;
  }

  openFolder(note: TeacherNoteViewType) {
    this.isCustomHeaderBack = true;

    if (this._currentUrl) {
      this._historyStack.push(this._currentUrl);
    }
    this._currentUrl = note.url;
    this._store.dispatch(new ResetSearchQuery());
    this._ionContent.scrollToTop(1000);
    this._store.dispatch(
      new LoadSelectedTeacherNotes({
        id: this.teacher.results.teacher.id,
        query: '',
        folderUrl: this._currentUrl,
      })
    );
  }

  reloadView(query: string) {
    const isInMyMedia = this._route.snapshot.data.downloaded;
    if (isInMyMedia) {
      this._store.dispatch(
        new LoadSelectedTeacherNotesOffline({
          id: this.teacher.results.teacher.id,
          query,
        })
      );
      return;
    }
    this._store.dispatch(
      new LoadSelectedTeacherNotes({
        id: this.teacher.results.teacher.id,
        query,
        folderUrl: this._currentUrl,
      })
    );
  }

  private _registerRemoveItemSuccessful() {
    this._subSink.sink = this._actions.pipe(ofActionSuccessful(RemoveItem)).subscribe(() => {
      const downloadedCount = this._store.selectSnapshot(
        TeacherNotesState.getDownloadedNotesByTeacherId({ id: this.teacher.results.teacher.id })
      )?.results?.notes?.results?.length;
      if (downloadedCount <= 0) {
        this._router.navigateByUrl('/media/teacher-notes');
      }
    });
  }
}
