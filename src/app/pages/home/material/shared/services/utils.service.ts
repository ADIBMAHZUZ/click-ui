import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DownloadItem } from 'src/app/shared/download/store/download.actions';
import { DownloadType } from 'src/app/shared/download/models/download-type.model';
import { DownloadingService } from 'src/app/teacher-notes/shared/services/downloading.service';
import { MaterialService } from '../../material.service';
import { DownloadMaterialDetailStateModel } from 'src/app/core/models';
import { MaterialState } from '../../store';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
@Injectable({ providedIn: 'root' })
export class UtilsService {
  constructor(
    private _alertController: AlertController,
    private _translateService: TranslateService,
    private _store: Store,
    private _downloadingService: DownloadingService,
    private _apiService: MaterialService
  ) {}

  public download(
    subject: BehaviorSubject<DownloadMaterialDetailStateModel>
  ): Observable<boolean> {
    const downloadType = DownloadType.LEARNING_MATERIAL;
    const downloadingSubject = this._downloadingService.addSubject(
      subject,
      downloadType
    );
    const state = downloadingSubject.value;
    const { id } = state.item;

    const updateDownloadingSubject = () => {
      const noteInStore = this._store.selectSnapshot(
        MaterialState.getDownloadedMaterialById({ id })
      );
      downloadingSubject.next(noteInStore);
    };
    return this._store.dispatch(
      new DownloadItem({
        downloadType,
        item: state.item,
        onProgress: updateDownloadingSubject,
        onComplete: () => {
          updateDownloadingSubject();
          this._downloadingService.removeSubject(downloadType, id);
        },
      })
    );
  }

  public sendDownloadRequest(id: string) {
    return this._apiService
      .downloadBookById(id)
      .pipe(map(({ success }) => success));
  }

  public sendRemoveRequest(id: string) {
    return this._apiService
      .deleteBookById(id)
      .pipe(map(({ success }) => success));
  }
  public async showAlertInvalid(): Promise<void> {
    const INVALID_BOOK = await this._translateService
      .get('HOME.LIBRARY.BOOK.DETAIL.ALERTS.INVALID_BOOK')
      .toPromise();
    const warningAlert = await this._alertController.create({
      header: INVALID_BOOK.title,
      message: INVALID_BOOK.message,
      cssClass: 'warning-alert',
    });
    await warningAlert.present();
  }
}
