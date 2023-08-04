import { tap, startWith, filter, withLatestFrom, map } from 'rxjs/operators';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  AlertController,
  ModalController,
  Platform,
  NavController,
  LoadingController,
  ViewWillEnter,
  ViewWillLeave,
} from '@ionic/angular';
import { NetworkService, MediaMusicService } from 'src/app/core/services';
import { interval, Subscription, Observable } from 'rxjs';
import { SubSink } from 'subsink';
import {
  MediaDetailUtilsService,
  ONE_MIN_AS_MILLISECONDS,
  ONE_DAY_AS_MILLISECONDS,
  MediaRelatedViewModel,
  DownloadMediaDetailStateModel,
  CategoryViewModel,
  MediaDetailViewModel,
  LocalPath,
} from '../shared';
import { TranslateService } from '@ngx-translate/core';
import { AuthState } from 'src/app/auth/store/auth.state';
import { Store, Select, Actions, ofActionSuccessful } from '@ngxs/store';
import { AudioViewComponent, VideoViewComponent, PdfViewerComponent } from 'src/app/shared/components';
import {
  LoadSelectedMediaOffline,
  LibraryState,
  ResetSelectedMedia,
  ToggleLikeMediaById,
  LoadRelatedMedias,
  ReturnMediaById,
  BorrowMediaById,
  ToggleReserveMediaById,
  RemoveCurrent,
  ExtendMedia,
  Downloaded,
} from '../store';
import { DownloadItem, DownloadType } from 'src/app/shared/download/';
import { Capacitor } from '@capacitor/core';
import { AddOfflineRequest, SetNavbarVisibility, SetTabbarVisibility } from 'src/app/core/store';
import { Location } from '@angular/common';
import { ElectronService } from 'ngx-electron';
import { getRemainingTime, MEDIA_ENDPOINTS } from 'src/app/shared/utils';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements ViewWillEnter, ViewWillLeave, OnDestroy {
  @Select(LibraryState.getSelectedMedia) mediaState$: Observable<DownloadMediaDetailStateModel>;
  @Select(LibraryState.getSelectedRelatedMedias) mediaRelatedVM$: Observable<MediaRelatedViewModel>;
  @ViewChild('ionContentList') ionContentListElement: IonContent;

  selectedImageUrl: string;
  expiredDate: { days: number; hours: number; minutes: number } = {
    days: 0,
    hours: 0,
    minutes: 0,
  };

  private _subSink = new SubSink();
  private _alertTranslate: any;
  private _mediaTypeFunctionsMap = {
    book: {
      view: (state) => this._viewPDF(state),
      preview: (state) => this._previewPDF(state),
    },
    audio: {
      view: (state) => this._viewMP3(state),
      preview: (state) => this._previewMP3(state),
    },
    video: {
      view: (state) => this._viewMP4(state),
      preview: (state) => this._previewMP4(state),
    },
  };
  private _intervalSubscription: Subscription;
  private _pdfModal: HTMLIonModalElement;
  private _videoModal: HTMLIonModalElement;

  constructor(
    private _route: ActivatedRoute,
    private _platform: Platform,
    private _network: NetworkService,
    private _alertCtrl: AlertController,
    private _modalCtrl: ModalController,
    private _utilsService: MediaDetailUtilsService,
    private _mediaMusicService: MediaMusicService,
    private _translate: TranslateService,
    private _store: Store,
    private _navCtrl: NavController,
    private _loadingCtrl: LoadingController,
    private _actions: Actions,
    private _location: Location,
    private _electronService: ElectronService,
    private _router: Router
  ) {}

  ionViewWillEnter() {
    this._registerLoadMediaCompleted();
    this._registerDownloadMediaCompleted();
    this._registerToggleReserveByIdCompleted();
    this._registerExtendMediaSuccessful();
    this._registerRemoveCurrentSuccessful();
    this._registerReturnMediaSuccessful();
    this._registerBorrowMediaSuccessful();
    this._store.dispatch([new SetNavbarVisibility(false), new SetTabbarVisibility(false), new ResetSelectedMedia()]);
    this._translate.get('HOME.LIBRARY.BOOK.DETAIL.ALERTS').subscribe((data) => {
      this._alertTranslate = data;
    });
    const id = this._route.snapshot.paramMap.get('id');

    this._store.dispatch(new LoadSelectedMediaOffline({ id }));
  }

  ionViewWillLeave(): void {
    this._intervalSubscription?.unsubscribe();
    this._subSink.unsubscribe();
    this._store.dispatch([new SetNavbarVisibility(true), new SetTabbarVisibility(true)]);
  }

  ngOnDestroy(): void {
    this.ionViewWillLeave();
  }

  toggleLiked() {
    this._store.dispatch(new ToggleLikeMediaById());
  }

  scrollDown() {
    this.ionContentListElement.scrollByPoint(0, 120, 300);
  }

  setSelectedImageUrl(url: string) {
    this.selectedImageUrl = url;
  }

  download(mediaState: DownloadMediaDetailStateModel) {
    this._store.dispatch(new DownloadItem({ downloadType: DownloadType.MEDIA, item: mediaState.item }));
  }

  async return(state: DownloadMediaDetailStateModel) {
    const { DO_YOU_WANT_TO_RETURN_THIS } = this._alertTranslate;
    const warningAlert = await this._alertCtrl.create({
      header: DO_YOU_WANT_TO_RETURN_THIS.do_you_want_to_return_this,
      message: `${state?.item.name}`,
      cssClass: 'warning-alert',
      buttons: [
        {
          text: DO_YOU_WANT_TO_RETURN_THIS.ok,
          handler: () => this._store.dispatch(new RemoveCurrent()),
        },
        {
          text: DO_YOU_WANT_TO_RETURN_THIS.cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {},
        },
      ],
    });
    await warningAlert.present();
  }

  async borrow(mediaState: DownloadMediaDetailStateModel) {
    const expirationTime = this._getMaxBorrowDateString(null);
    if (mediaState.item.remainingBorrowTimes <= 0) {
      const { you_reach_the_limit_of } = this._alertTranslate;
      const warningAlert = await this._alertCtrl.create({
        header: mediaState.item.name,
        message: you_reach_the_limit_of,
        cssClass: 'warning-alert',
      });
      await warningAlert.present();
      return;
    }
    const { DO_YOU_WANT_TO_BORROW_THIS, DO_YOU_WANT_TO_RETURN_THIS } = this._alertTranslate;
    this._alertCtrl
      .create({
        header: DO_YOU_WANT_TO_BORROW_THIS.title,
        message: `${mediaState.item.name}<br/>${DO_YOU_WANT_TO_BORROW_THIS.message} ${expirationTime.substring(0, 10)}`,
        cssClass: 'warning-alert',
        buttons: [
          {
            text: DO_YOU_WANT_TO_RETURN_THIS.ok,
            handler: () => {
              this._handleBorrow(mediaState, expirationTime);
            },
          },
          { text: DO_YOU_WANT_TO_RETURN_THIS.cancel, role: 'cancel', cssClass: 'secondary' },
        ],
      })
      .then((warningAlert) => warningAlert.present());
  }

  async extend(state: DownloadMediaDetailStateModel) {
    const expirationTime = this._getMaxBorrowDateString(state.item.expirationTime);
    const { DO_YOU_WANT_TO_RETURN_THIS, DO_YOU_WANT_TO_EXTEND_THIS } = this._alertTranslate;
    const warningAlert = await this._alertCtrl.create({
      header: DO_YOU_WANT_TO_EXTEND_THIS.title,
      message: `${state?.item.name}<br/>${DO_YOU_WANT_TO_EXTEND_THIS.message} ${expirationTime}`,
      cssClass: 'warning-alert',
      buttons: [
        {
          text: DO_YOU_WANT_TO_RETURN_THIS.ok,
          handler: () => {
            this._handleExtend(state, expirationTime);
          },
        },
        {
          text: DO_YOU_WANT_TO_RETURN_THIS.cancel,
          role: 'cancel',
          cssClass: 'secondary',
        },
      ],
    });
    await warningAlert.present();
  }

  async reserve(item: MediaDetailViewModel) {
    const { DO_YOU_WANT_TO_RETURN_THIS, DO_YOU_WANT_TO_RESERVE_THIS, RESERVE_INFORMATION } = this._alertTranslate;
    const isReserved = item.reservedIndex > 0;
    if (isReserved) {
      const cancelAlert = await this._alertCtrl.create({
        header: RESERVE_INFORMATION.title,
        message: `${RESERVE_INFORMATION.message}: ${item.reservedIndex}<br/>${RESERVE_INFORMATION.message1}`,
        cssClass: 'warning-alert',
        buttons: [
          {
            text: DO_YOU_WANT_TO_RETURN_THIS.ok,
            handler: () => {
              this._handleCancelReserve(item);
            },
          },
          {
            text: DO_YOU_WANT_TO_RETURN_THIS.cancel,
            role: 'cancel',
            cssClass: 'secondary',
          },
        ],
      });
      await cancelAlert.present();
      return;
    }
    const warningAlert = await this._alertCtrl.create({
      header: DO_YOU_WANT_TO_RESERVE_THIS.title,
      message: `${item.name}`,
      cssClass: 'warning-alert',
      buttons: [
        {
          text: DO_YOU_WANT_TO_RETURN_THIS.ok,
          handler: () => {
            this._handleReserve(item);
          },
        },
        {
          text: DO_YOU_WANT_TO_RETURN_THIS.cancel,
          role: 'cancel',
          cssClass: 'secondary',
        },
      ],
    });

    await warningAlert.present();
  }

  getCategoryNamesAsString(categories: CategoryViewModel[]): string {
    if (!categories) {
      return;
    }
    return categories.map((category) => category.name).join(', ');
  }

  async view(state: DownloadMediaDetailStateModel) {
    const loadingMessage = await this._translate.get('HOME.LIBRARY.BOOK.DETAIL.waiting_for_decryption').toPromise();
    const loading = await this._loadingCtrl.create({
      message: loadingMessage,
      duration: ONE_MIN_AS_MILLISECONDS * 5,
    });
    await loading.present();
    await this._mediaTypeFunctionsMap[state.item.mediaType].view(state);
  }

  async preview(state: DownloadMediaDetailStateModel) {
    this._mediaTypeFunctionsMap[state.item.mediaType].preview(state);
  }

  async getDecryptedFilePath(path: LocalPath, key: string, fileSize: number, isVideo?: boolean): Promise<string> {
    if (fileSize >= 200) {
      return '';
    }

    const arrayBuffer = await this._utilsService.getFileContent(path);
    const decryptedBlob = await this._utilsService.decryptToBlob(arrayBuffer, key, isVideo);
    // await this._utilsService.writeDecryptedFile(decryptedBlob, path.name);

    // return this._utilsService.getDecryptedFilePath(path);
    return URL.createObjectURL(decryptedBlob);
  }

  back({ id, mediaType }) {
    this._router.navigateByUrl(`/home/library/${mediaType}/detail/${id}`);
  }

  goBack() {
    this._location.back();
  }

  private async _earlyCheckBorrowAndExtendPassed(state: DownloadMediaDetailStateModel): Promise<boolean> {
    if (state.downloading?.downloadedSize > 0) {
      return false;
    }
    return true;
  }

  private async _handleBorrow(mediaState: DownloadMediaDetailStateModel, expirationTime: string) {
    const earlyCheckIsPassed = await this._earlyCheckBorrowAndExtendPassed(mediaState);
    if (!earlyCheckIsPassed) {
      return;
    }

    if (!mediaState.item.isBorrowed) {
      this._store.dispatch(new BorrowMediaById({ id: mediaState.item.id, expirationTime }));
    }
  }

  private async _handleExtend(state: DownloadMediaDetailStateModel, expirationTime: string) {
    const earlyCheckIsPassed = await this._earlyCheckBorrowAndExtendPassed(state);
    if (!earlyCheckIsPassed) {
      return;
    }
    this._store.dispatch(new ExtendMedia({ expirationTime }));
  }

  private _handleReserve(item: MediaDetailViewModel) {
    this._store.dispatch(new ToggleReserveMediaById({ id: item.id, isCancelled: false }));
  }

  private _handleCancelReserve(item: MediaDetailViewModel) {
    this._store.dispatch(new ToggleReserveMediaById({ id: item.id, isCancelled: true }));
  }

  private _toggleInterval(state: DownloadMediaDetailStateModel): void {
    this._intervalSubscription?.unsubscribe();
    this._intervalSubscription = interval(ONE_MIN_AS_MILLISECONDS)
      .pipe(
        startWith(0),
        filter(() => state?.downloaded && !!state.item),
        tap(() => {
          const remainingTime = new Date(state.item.expirationTime).getTime() - new Date().getTime();

          if (Number.isNaN(remainingTime) || remainingTime <= 0) {
            this._videoModal?.dismiss();
            this._pdfModal?.dismiss();
            this._intervalSubscription?.unsubscribe();
            this._translate
              .get('HOME.LIBRARY.BOOK.DETAIL.ALERTS.BORROWING_TIMED_UP')
              .pipe(
                tap(async (translation) => {
                  const warningAlert = await this._alertCtrl.create({
                    header: translation.title,
                    message: state.item.name + translation.message,
                    cssClass: 'warning-alert',
                  });
                  await warningAlert.present();
                })
              )
              .subscribe();
            this._store.dispatch(new RemoveCurrent());
            this._intervalSubscription.unsubscribe();
            return;
          }
          this.expiredDate = getRemainingTime(state.item.expirationTime);
        })
      )
      .subscribe();
  }

  private async _previewMP3(state: DownloadMediaDetailStateModel) {
    if (this._mediaMusicService.isPlaying()) {
      this._mediaMusicService.stop();
    }
    if (this._electronService.isElectronApp) {
      const url = state.item.previewUrl;
      this._mediaMusicService.setMediaInformation(state.item, url);
    } else {
      const previewPath = await this._utilsService.getPreviewURL(state);
      this._mediaMusicService.setMediaInformation(state.item, previewPath.directory + previewPath.name, () => {
        this._utilsService.removeFile(previewPath);
      });
    }
    this._mediaMusicService.reload();
    const modal = await this._modalCtrl.create({
      component: AudioViewComponent,
      swipeToClose: true,
      cssClass: 'small-modal',
    });
    await modal.present();
    this._mediaMusicService.play();
  }

  private async _viewMP3(state: DownloadMediaDetailStateModel) {
    try {
      const key = state.item.encryptKey;
      const isVideo = true;
      const viewPath = await this.getDecryptedFilePath(state.path, key, state.item.fileSize, isVideo);
      if (this._electronService.isElectronApp) {
        // url = `file://${viewPath.directory}${viewPath.name}`;
      }
      if (this._mediaMusicService.isPlaying()) {
        this._mediaMusicService.stop();
      }
      this._mediaMusicService.setMediaInformation(state.item, viewPath, async () => {
        if (state.item.fileSize < 200) {
          URL.revokeObjectURL(viewPath);
        }
      });
      this._mediaMusicService.reload();

      this._mediaMusicService.play();
    } catch (err) {
      console.warn(err);
      const { VIEW_FAILED } = this._alertTranslate;
      const dangerAlert = await this._alertCtrl.create({
        header: VIEW_FAILED.view_failed,
        message: VIEW_FAILED.view_is_not_available_please,
        cssClass: 'danger-alert',
      });
      await dangerAlert.present();
    } finally {
      await this._loadingCtrl.dismiss();
    }
  }

  private async _previewMP4(state: DownloadMediaDetailStateModel) {
    this._mediaMusicService.stop();
    if (this._electronService.isElectronApp) {
      this._modalCtrl
        .create({
          component: VideoViewComponent,
          swipeToClose: true,
          cssClass: 'small-modal',
          componentProps: {
            path: state.item.previewUrl,
          },
        })
        .then((m) => m.present());
      return;
    }
    const previewPath = await this._utilsService.getPreviewURL(state);
    const { directory, name } = previewPath;
    let url = `${directory}${name}`;
    if (this._platform.is('ios')) {
      url = url.replace(/^file:\/\//, '');
    }
    const modal = await this._modalCtrl.create({
      component: VideoViewComponent,
      swipeToClose: true,
      cssClass: 'small-modal',
      componentProps: {
        path: url,
      },
    });
    modal.onDidDismiss().then(() => {
      this._utilsService.removeFile(previewPath);
    });
    await modal.present();
  }

  private async _viewMP4(state: DownloadMediaDetailStateModel): Promise<void> {
    try {
      const key = state.item.encryptKey;
      const isVideo = true;
      const viewPath = await this.getDecryptedFilePath(state.path, key, state.item.fileSize, isVideo);

      this._videoModal = await this._modalCtrl.create({
        component: VideoViewComponent,
        swipeToClose: true,
        cssClass: 'small-modal',
        componentProps: { path: viewPath },
      });
      this._videoModal.onDidDismiss().then(async () => {
        if (state.item.fileSize < 200) {
          URL.revokeObjectURL(viewPath);
        }
      });
      await this._videoModal.present();
    } catch (err) {
      console.warn(err);

      const { VIEW_FAILED } = this._alertTranslate;
      const dangerAlert = await this._alertCtrl.create({
        header: VIEW_FAILED.view_failed,
        message: VIEW_FAILED.view_is_not_available_please,
        cssClass: 'danger-alert',
      });
      await dangerAlert.present();
    } finally {
      await this._loadingCtrl.dismiss();
    }
  }

  private _previewPDF(state: DownloadMediaDetailStateModel) {
    this._modalCtrl
      .create({
        component: PdfViewerComponent,
        cssClass: 'modal-fullscreen',
        componentProps: {
          path: state.item.previewUrl,
          isPreview: true,
        },
      })
      .then((modal) => modal.present());
  }

  private async _viewPDF(state: DownloadMediaDetailStateModel) {
    try {
      const viewPath = await this.getDecryptedFilePath(state.path, state.item.encryptKey, state.item.fileSize);
      let fileSrc = Capacitor.convertFileSrc(viewPath);

      const props = {
        path: fileSrc,
        bookmarks: state.bookmarks,
        id: state.item.id,
        downloadType: DownloadType.MEDIA,
      };
      this._pdfModal = await this._modalCtrl.create({
        component: PdfViewerComponent,
        cssClass: 'modal-fullscreen',
        componentProps: props,
        // backdropDismiss:true
        showBackdrop: true,
      });
      this._pdfModal.onDidDismiss().then(async () => {
        if (state.item.fileSize < 200) {
          // await this._utilsService.removeFile(viewPath);
          URL.revokeObjectURL(viewPath);
        }
        this._store.dispatch(
          new LoadSelectedMediaOffline({
            id: state.item.id,
          })
        );
      });
      await this._pdfModal.present();
    } catch (error) {
      console.warn(error);
      const { VIEW_FAILED } = this._alertTranslate;
      const dangerAlert = await this._alertCtrl.create({
        header: VIEW_FAILED.view_failed,
        message: VIEW_FAILED.view_is_not_available_please,
        cssClass: 'danger-alert',
      });
      await dangerAlert.present();
    } finally {
      await this._loadingCtrl.dismiss();
    }
  }

  private _getMaxBorrowDateString(fromStr: string): string {
    const duration = this._store.selectSnapshot(AuthState.getUserInfo).maxBorrowDuration;
    const fromDay = fromStr ? new Date(fromStr) : new Date();
    const after10DaysDate = new Date(fromDay.getTime() + duration * ONE_DAY_AS_MILLISECONDS);
    return after10DaysDate.toISOString().substring(0, 10);
  }

  private _registerRemoveCurrentSuccessful() {
    this._subSink.sink = this._actions.pipe(ofActionSuccessful(RemoveCurrent), withLatestFrom(this.mediaState$)).subscribe(([, state]) => {
      const { RETURN_BOOK } = this._alertTranslate;
      this._alertCtrl
        .create({
          header: RETURN_BOOK.title,
          message: RETURN_BOOK.message,
          cssClass: 'success-alert',
        })
        .then((warningAlert) => warningAlert.present());
      if (state.item.isBorrowed) {
        if (!this._network.isConnected()) {
          this._store.dispatch(
            new AddOfflineRequest({
              request: { method: 'post', url: `${MEDIA_ENDPOINTS.media}${state?.item?.subscriber_media?.library_media}/return/` },
            })
          );
          this._navCtrl.back();
        } else {
          this._store.dispatch(new ReturnMediaById(state?.item?.subscriber_media?.library_media?.toString()));
        }
      }
    });
  }

  private _registerExtendMediaSuccessful() {
    this._subSink.sink = this._actions.pipe(ofActionSuccessful(ExtendMedia), withLatestFrom(this.mediaState$)).subscribe(([, state]) => {
      this._store.dispatch(new LoadSelectedMediaOffline({ id: state.item.id }));
      const { EXTEND_SUCCESSFULLY } = this._alertTranslate;
      this._alertCtrl
        .create({
          header: EXTEND_SUCCESSFULLY.extend_successfully_,
          message: EXTEND_SUCCESSFULLY.extend_is_successful__have,
          cssClass: 'success-alert',
        })
        .then((successAlert) => successAlert.present());
    });
  }

  private _registerBorrowMediaSuccessful() {
    this._subSink.sink = this._actions
      .pipe(ofActionSuccessful(BorrowMediaById), withLatestFrom(this.mediaState$))
      .subscribe(([, state]) => {
        this.download(state);
      });
  }

  private _registerToggleReserveByIdCompleted() {
    this._subSink.sink = this._actions
      .pipe(
        ofActionSuccessful(ToggleReserveMediaById),
        map((action: ToggleReserveMediaById) => {
          return action.payload.isCancelled;
        }),
        withLatestFrom(this.mediaState$)
      )
      .subscribe(async ([isCancelled, state]) => {
        const translation = isCancelled ? this._alertTranslate.CANCEL_RESERVE_SUCCESSFULLY : this._alertTranslate.RESERVE_SUCCESSFULLY;
        const { id, name } = state.item;
        const warningAlert = await this._alertCtrl.create({
          header: translation.title,
          message: name,
          cssClass: 'success-alert',
        });
        await warningAlert.present();

        this._store.dispatch(new LoadSelectedMediaOffline({ id }));
      });
  }

  private _registerReturnMediaSuccessful() {
    this._subSink.sink = this._actions
      .pipe(ofActionSuccessful(ReturnMediaById), withLatestFrom(this.mediaState$))
      .subscribe(([, state]) => {
        this._store.dispatch(new LoadSelectedMediaOffline({ id: state.item?.subscriber_media?.library_media.toString() }));
      });
  }

  private _registerDownloadMediaCompleted() {
    this._subSink.sink = this._actions.pipe(ofActionSuccessful(Downloaded), withLatestFrom(this.mediaState$)).subscribe(([, state]) => {
      this._store.dispatch(new LoadSelectedMediaOffline({ id: state.item.id }));
    });
  }

  private _registerLoadMediaCompleted() {
    this._subSink.sink = this._actions
      .pipe(
        ofActionSuccessful(LoadSelectedMediaOffline),
        withLatestFrom(this.mediaState$),
        filter(([, state]) => !!state)
      )
      .subscribe(([, state]) => {
        if (this._network.isConnected()) {
          this._store.dispatch(new LoadRelatedMedias());
        }
        // Set bigest thumbnail
        if (!this.selectedImageUrl) {
          this.selectedImageUrl = state.item.thumbnail;
        }
        if (state.downloaded && !state.item.isBorrowed) {
          this._store.dispatch(new RemoveCurrent());
          this._navCtrl.back();
          return;
        }
        if (!state.downloaded && !this._network.isConnected()) {
          const { NO_INTERNET_CONNECTION } = this._alertTranslate;
          this._alertCtrl
            .create({
              header: NO_INTERNET_CONNECTION.title,
              message: NO_INTERNET_CONNECTION.message,
              cssClass: 'warning-alert',
            })
            .then((warningAlert) => warningAlert.present());
          this._navCtrl.back();
        }

        const isDownloadable =
          state.item.isBorrowed && !state.downloaded && (!state.downloading || state.downloading?.downloadedSize === 0);

        if (isDownloadable) {
          this.download(state);
        }
        if (state.downloaded) {
          this._toggleInterval(state);
        }
      });
  }
}
