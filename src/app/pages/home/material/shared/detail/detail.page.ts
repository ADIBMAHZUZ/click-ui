import { map, switchMap, switchMapTo, tap, take } from 'rxjs/operators';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, AlertController, NavController, IonTabs, ModalController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { NetworkService, MediaMusicService } from 'src/app/core/services';
import { SubSink } from 'subsink';
import { AudioViewComponent, VideoViewComponent, PdfViewerComponent } from 'src/app/shared/components';
import { Capacitor } from '@capacitor/core';

import { DownloadMaterialDetailStateModel } from 'src/app/core/models';
import { Select, Store } from '@ngxs/store';
import { MaterialState, LoadSelectedMaterial, LoadSelectedMaterialOffline } from '../../store';
import { Observable, BehaviorSubject, combineLatest, interval } from 'rxjs';
import { DownloadingService } from 'src/app/teacher-notes/shared/services/downloading.service';
import { UtilsService } from '../services/utils.service';
import { RemoveItem } from 'src/app/shared/download/store/download.actions';
import { DownloadType } from 'src/app/shared/download/models/download-type.model';
import { LEARNING_MATERIAL_ENDPOINTS } from 'src/app/shared/utils/endpoints.api';
import { AddOfflineRequest, SetNavbarVisibility, SetTabbarVisibility } from 'src/app/core/store';
import { Location } from '@angular/common';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage {
  @Select(MaterialState.getSelectedMaterial) materialState$: Observable<DownloadMaterialDetailStateModel>;
  @ViewChild('ionContentList') ionContentListElement: IonContent;
  @ViewChild(IonTabs) ionTabs: IonContent;

  materialStateSubject: BehaviorSubject<DownloadMaterialDetailStateModel>;
  selectedImageUrl: string;
  expiredDate: { days: number; hours: number; minutes: number };

  private _subSink = new SubSink();
  private _alertTranslate: any;
  private _id: string;
  private _mediaTypeFunctionsMap = {
    book: { view: () => this.viewPDF() },
    audio: { view: () => this.viewMP3() },
    video: { view: () => this.viewMP4() },
  };
  constructor(
    private _route: ActivatedRoute,
    private _navCtrl: NavController,
    private _network: NetworkService,
    private _alertCtrl: AlertController,
    private _translate: TranslateService,
    private _mediaMusicService: MediaMusicService,
    private _modalCtrl: ModalController,
    private _platform: Platform,
    private _store: Store,
    private _downloadingService: DownloadingService,
    private _utilsService: UtilsService,
    private _location: Location,
    private _electron: ElectronService
  ) {}

  ionViewWillEnter() {
    this._store.dispatch([new SetNavbarVisibility(true), new SetTabbarVisibility(true)]);
    this._subSink.sink = this._translate.get('HOME.LIBRARY.BOOK.DETAIL.ALERTS').subscribe((data) => {
      this._alertTranslate = data;
    });
    const data$ = this._route.data;
    const id$ = this._route.paramMap.pipe(
      map((params) => params.get('id')),
      tap((id) => (this._id = id))
    );
    this._subSink.sink = combineLatest([id$, data$])
      .pipe(
        switchMap(([id, data]) => {
          if (data.downloaded) {
            return this._store.dispatch(new LoadSelectedMaterialOffline({ id }));
          }
          return this._store.dispatch(new LoadSelectedMaterial({ id }));
        }),
        switchMapTo(this.materialState$)
      )
      .subscribe(async (state) => {
        if (!state) {
          return;
        }
        if (!state.item) {
          await this._utilsService.showAlertInvalid();
          this._store.dispatch(
            new RemoveItem({
              downloadType: DownloadType.LEARNING_MATERIAL,
              id: this._id,
            })
          );
          this._navCtrl.back();
          return;
        }

        this.materialStateSubject = this.toBehaviorSubject(state);
        if (state.downloaded && !state.item.isBorrowed) {
          this._translate.get('HOME.LIBRARY.BOOK.DETAIL.ALERTS.RETURN_BOOK').subscribe((RETURN_BOOK) => {
            this._alertCtrl
              .create({
                header: RETURN_BOOK.title,
                message: RETURN_BOOK.message,
                cssClass: 'warning-alert',
              })
              .then(async (warningAlert) => {
                await this._handleReturn(this.materialStateSubject.value);
                await warningAlert.present();
              })
              .then(() => this._navCtrl.back());
          });
          return;
        }
        if (!state.downloaded && !this._network.isConnected()) {
          this._translate.get('HOME.LIBRARY.BOOK.DETAIL.ALERTS.NO_INTERNET_CONNECTION').subscribe(async (NO_INTERNET_CONNECTION) => {
            const warningAlert = await this._alertCtrl.create({
              header: NO_INTERNET_CONNECTION.title,
              message: NO_INTERNET_CONNECTION.message,
              cssClass: 'warning-alert',
            });
            await warningAlert.present();
            this._navCtrl.back();
          });
        }

        this.selectedImageUrl = state?.item.thumbnail;
      });
    const autoDownloadInterval = interval(100)
      .pipe(take(70))
      .subscribe(() => {
        if (!this.materialStateSubject || !this.materialStateSubject?.getValue()) {
          return;
        }
        const state = this.materialStateSubject.getValue();
        if (!state.item.isBorrowed) {
          autoDownloadInterval.unsubscribe();
        }
        const isDownloadable =
          state.item.isBorrowed &&
          !state.downloaded &&
          (!state.downloading || (state.downloading && state.downloading.downloadedSize == 0));
        if (isDownloadable) {
          this.download(this.materialStateSubject);
          autoDownloadInterval.unsubscribe();
        }
      });
    this._subSink.sink = autoDownloadInterval;
  }

  ionViewWillLeave(): void {
    this._store.dispatch([new SetNavbarVisibility(true), new SetTabbarVisibility(true)]);

    this._subSink.unsubscribe();
  }

  async scrollDown() {
    await this.ionContentListElement.scrollByPoint(0, 120, 300);
  }
  setSelectedImageUrl(url: string) {
    this.selectedImageUrl = url;
  }

  async download(materialSubject: BehaviorSubject<DownloadMaterialDetailStateModel>) {
    const state = materialSubject.value;
    const { id, name, isBorrowed } = state.item;
    if (state.downloading?.downloadedSize > 0) {
      return;
    }
    try {
      let isSuccess = false;
      if (!state.downloaded && !isBorrowed) {
        await this._utilsService.sendDownloadRequest(id).toPromise();
      }
      isSuccess = await this._utilsService.download(materialSubject).toPromise();

      if (isSuccess) {
        const { BORROW_SUCCESSFULLY } = this._alertTranslate;
        const warningAlert = await this._alertCtrl.create({
          header: BORROW_SUCCESSFULLY.borrow_successfully,
          message: `${name}<br/>
                        ${BORROW_SUCCESSFULLY.borrow_is_successfully__have}`,
          cssClass: 'success-alert',
        });
        await warningAlert.present();
      } else {
        const { you_reach_the_limit_of } = this._alertTranslate;
        const warningAlert = await this._alertCtrl.create({
          header: name,
          message: you_reach_the_limit_of,
          cssClass: 'warning-alert',
        });
        await warningAlert.present();
      }
    } catch (err) {
      console.warn(err);

      if (err.code === 4) {
        return;
      }
      const { BORROW_FAILED } = this._alertTranslate;
      const dangerAlert = await this._alertCtrl.create({
        header: BORROW_FAILED.borrow_failed,
        message: BORROW_FAILED.borrow_is_not_available,
        cssClass: 'danger-alert',
      });
      await dangerAlert.present();
    }
  }
  async remove(state: DownloadMaterialDetailStateModel) {
    const translation = await this._translate.get('MATERIAL.DETAIL.ALERTS.DO_YOU_WANT_TO_DELETE_THIS').toPromise();
    const warningAlert = await this._alertCtrl.create({
      header: translation.do_you_want_to_delete_this,
      message: `${state?.item.name}`,
      cssClass: 'warning-alert',
      buttons: [
        {
          text: translation.ok,
          handler: () => {
            this._handleReturn(state);
          },
        },
        {
          text: translation.cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {},
        },
      ],
    });
    await warningAlert.present();
  }
  view() {
    this._mediaTypeFunctionsMap[this.materialStateSubject.value.item.mediaType].view();
  }
  async viewPDF() {
    try {
      const state = this.materialStateSubject.value;
      const { directory, name } = state.path;

      if (this._electron.isElectronApp) {
        this._electron.shell.openExternal(`file://${directory}${name}`);
        return;
      }
      const props = {
        path: Capacitor.convertFileSrc(directory + name),
        bookmarks: state.bookmarks,
        id: state.item.id,
        downloadType: DownloadType.LEARNING_MATERIAL,
      };
      const modal = await this._modalCtrl.create({
        component: PdfViewerComponent,
        cssClass: 'modal-fullscreen',
        componentProps: props,
      });
      await modal.present();
      modal.onDidDismiss().then(() => {
        this._store.dispatch(
          new LoadSelectedMaterialOffline({
            id: state.item.id,
          })
        );
      });
    } catch (error) {
      const { VIEW_FAILED } = this._alertTranslate;
      const dangerAlert = await this._alertCtrl.create({
        header: VIEW_FAILED.view_failed,
        message: VIEW_FAILED.view_is_not_available_please,
        cssClass: 'danger-alert',
      });
      await dangerAlert.present();
    }
  }
  async viewMP4(): Promise<void> {
    const { directory, name } = this.materialStateSubject.value.path;
    if (this._electron.isElectronApp) {
      this._electron.shell.openExternal(`file://${directory}${name}`);
      return;
    }
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
  async viewMP3() {
    const { directory, name } = this.materialStateSubject.value.path;
    if (this._electron.isElectronApp) {
      this._electron.shell.openExternal(`file://${directory}${name}`);
      return;
    }
    let url = `${directory}${name}`;
    if (this._platform.is('ios')) {
      url = url.replace(/^file:\/\//, '');
    }
    if (this._mediaMusicService.isPlaying()) {
      this._mediaMusicService.stop();
    }
    this._mediaMusicService.setMediaInformation(null, url);
    this._mediaMusicService.setTitle(this.materialStateSubject.value.item.name);
    this._mediaMusicService.reload();
    const modal = await this._modalCtrl.create({
      component: AudioViewComponent,
      swipeToClose: true,
      cssClass: 'my-custom-modal-css',
    });
    await modal.present();
    this._mediaMusicService.play();
  }

  getDownloadingPercentage(): number {
    if (this.materialStateSubject && this.materialStateSubject.value.downloading) {
      const { downloadedSize = 0, totalSize = 1 } = this.materialStateSubject.value.downloading;
      return downloadedSize / totalSize;
    }
    return 0;
  }

  private async _handleReturn(state: DownloadMaterialDetailStateModel) {
    const { id } = state.item;
    await this._store
      .dispatch(
        new RemoveItem({
          id: state.item.id,
          downloadType: DownloadType.LEARNING_MATERIAL,
        })
      )
      .toPromise();
    const translation = await this._translate.get('MATERIAL.DETAIL.ALERTS.DELETED_SUCCESSFULLY').toPromise();
    const successAlert = await this._alertCtrl.create({
      header: translation.Delete_successfully,
      message: translation.Delete_is_successfully__have,
      cssClass: 'success-alert',
    });
    await successAlert.present();

    if (state.item.isBorrowed) {
      if (!this._network.isConnected()) {
        this._store.dispatch(
          new AddOfflineRequest({
            request: {
              method: 'post',
              url: `${LEARNING_MATERIAL_ENDPOINTS.learningMaterial}${id}/return/`,
            },
          })
        );
        this._navCtrl.back();
      } else {
        await this._utilsService.sendRemoveRequest(id).toPromise();
        this._store.dispatch(new LoadSelectedMaterial({ id }));
      }
    }
  }

  public toBehaviorSubject(noteState: DownloadMaterialDetailStateModel): BehaviorSubject<DownloadMaterialDetailStateModel> {
    const subject = this._downloadingService.getSubject(DownloadType.LEARNING_MATERIAL, noteState.item.id);
    return subject ?? new BehaviorSubject(noteState);
  }

  goBack() {
    this._location.back();
  }
}
