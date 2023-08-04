import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { MaterialDetailViewModel } from 'src/app/core/models';
import { Select, Store } from '@ngxs/store';
import {
  DownloadType,
  DownloadableType,
  DownloadDetailState,
  RemoveItem,
  DownloadState,
  DownloadStateModel,
} from 'src/app/shared/download';
import { MediaDetailViewModel } from '../../home/library/shared';
import { UtilsService as TeacherNoteUtilsService, TeacherNoteViewType } from 'src/app/teacher-notes/shared/';
import { UtilsService as MaterialUtilsService } from '../../home/material/shared/services/utils.service';
import { ReturnMediaById } from '../../home/library/store';
import { AbortEvent } from './download-item/download-item.component';
import { SubSink } from 'subsink';
import { debounceTime } from 'rxjs/operators';

const downloadingFilterCallback = (item: DownloadDetailState<DownloadableType>) => item.downloading?.downloadedSize > 0;
@Component({
  selector: 'app-download',
  templateUrl: './download.page.html',
  styleUrls: ['./download.page.scss'],
})
export class DownloadPage implements ViewWillEnter, ViewWillLeave {
  @Select(DownloadState.getDownloaded) downloaded$: Observable<DownloadStateModel['downloaded']>;
  mediaStates: DownloadDetailState<MediaDetailViewModel>[];
  materialStates: DownloadDetailState<MaterialDetailViewModel>[];
  teacherNotesStates: DownloadDetailState<TeacherNoteViewType>[];

  private _subSink = new SubSink();

  constructor(
    private _translateService: TranslateService,
    private _alertController: AlertController,
    private _materialService: MaterialUtilsService,
    private _teacherNoteService: TeacherNoteUtilsService,
    private _store: Store
  ) {}

  ionViewWillEnter(): void {
    this._subSink.sink = this.downloaded$.pipe(debounceTime(100)).subscribe((downloaded) => {
      this.mediaStates = Object.values(downloaded.medias).filter(downloadingFilterCallback);
      this.materialStates = Object.values(downloaded.learningMaterials).filter(downloadingFilterCallback);
      this.teacherNotesStates = Object.values(downloaded.teacherNotes).filter(downloadingFilterCallback);
    });
  }

  ionViewWillLeave(): void {
    this._subSink.unsubscribe();
  }

  async abort(event: AbortEvent): Promise<void> {
    const { state, downloadType } = event;
    if (!state.downloaded) {
      const { DO_YOU_WANT_TO_RETURN_THIS } = await this._translateService.get('HOME.LIBRARY.BOOK.DETAIL.ALERTS').toPromise();
      const warningAlert = await this._alertController.create({
        header: DO_YOU_WANT_TO_RETURN_THIS.do_you_want_to_return_this,
        message: `${state?.item.name} <br/> ${DO_YOU_WANT_TO_RETURN_THIS.do_you_want_to_return_this}`,
        cssClass: 'warning-alert',
        buttons: [
          {
            text: DO_YOU_WANT_TO_RETURN_THIS.ok,
            handler: () => this._handleReturn(state, downloadType),
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
  }

  private async _handleReturn(state: DownloadDetailState<DownloadableType>, downloadType: DownloadType): Promise<void> {
    const { id } = state.item;
    try {
      state.downloading.transferStream?.abort();
    } catch (error) {
      console.warn(error);
    }
    this._store.dispatch(new RemoveItem({ downloadType, id }));
    if (downloadType === DownloadType.MEDIA) {
      this._store.dispatch(new ReturnMediaById(id));
    }
    if (downloadType === DownloadType.LEARNING_MATERIAL) {
      this._materialService.sendRemoveRequest(id).toPromise();
    }
    if (downloadType === DownloadType.TEACHER_NOTE) {
      this._teacherNoteService.sendRemoveRequest(id).toPromise();
    }
    const { your_media_is_returned_to } = await this._translateService.get('HOME.LIBRARY.BOOK.DETAIL.ALERTS').toPromise();
    const successAlert = await this._alertController.create({
      header: your_media_is_returned_to,
      message: state?.item.name,
      cssClass: 'success-alert',
    });
    await successAlert.present();
  }
}
