import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
// import { DatePicker } from '@ionic-native/date-picker/ngx';
import { AlertController, Platform, NavController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { LibraryMediaService } from './api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { LibraryState } from '../../store';
import { DownloadMediaDetailStateModel, LocalPath } from '../models';
import { DownloadType } from 'src/app/shared/download/models/download-type.model';
import { DownloadItem } from 'src/app/shared/download/store/download.actions';
import { Store } from '@ngxs/store';
import { getFileExtension } from 'src/app/shared/utils';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import * as CryptoJS from 'crypto-js';
import { DownloadingService } from 'src/app/teacher-notes/shared/services/downloading.service';
import * as Base64ArrayBuffer from 'base64-arraybuffer';
import { DirectoryNames } from 'src/app/shared/download';
import { Capacitor } from '@capacitor/core';
import writeFile from 'capacitor-blob-writer';
import { ElectronService } from 'ngx-electron';

@Injectable({ providedIn: 'root' })
export class MediaDetailUtilsService {
  constructor(
    // private _datePicker: DatePicker,
    private _translateService: TranslateService,
    private _sanitizer: DomSanitizer,
    private _navCtrl: NavController,
    private _alertCtrl: AlertController,
    private _downloadingService: DownloadingService,
    private _platform: Platform,
    private _file: File,
    private _fileTransfer: FileTransfer,
    private _store: Store,
    private _apiService: LibraryMediaService,
    private _electronService: ElectronService
  ) {}
  /**
  public async getDate(options: GetDateParams): Promise<string> {
    const { max, min = new Date() } = options;
    const CHOOSE_DATE_FAILED = await this._translateService
      .get('HOME.LIBRARY.BOOK.DETAIL.ALERTS.CHOOSE_DATE_FAILED')
      .toPromise();
    let expirationTime: Date;
    let isAfterToday = true;
    let isAtMost10Days = true;

    do {
      expirationTime = await this._datePicker.show({
        date: min,
        mode: 'date',
        allowOldDates: false,
        androidTheme: this._datePicker.ANDROID_THEMES.THEME_HOLO_DARK,
      });
      if (!expirationTime) {
        return null;
      }
      isAfterToday = expirationTime.getTime() > min.getTime();
      isAtMost10Days = expirationTime.getTime() < max.getTime();
      if (!isAfterToday) {
        const warningAlert = await this._alertCtrl.create({
          header: CHOOSE_DATE_FAILED.choose_date_failed,
          message: `${
            CHOOSE_DATE_FAILED.please_choose_a_date_after
          } ${min.toLocaleDateString()}.`,
          cssClass: 'warning-alert',
        });
        await warningAlert.present();
      } else if (!isAtMost10Days) {
        const warningAlert = await this._alertCtrl.create({
          header: CHOOSE_DATE_FAILED.choose_date_failed,
          message: `${
            CHOOSE_DATE_FAILED.please_choose_a_date_before
          } ${new Date(
            max.getTime() - ONE_DAY_AS_MILLISECONDS
          ).toLocaleDateString()}.`,
          cssClass: 'warning-alert',
        });
        await warningAlert.present();
      }
    } while (!isAfterToday || !isAtMost10Days);
    if (this._platform.is('android')) {
      expirationTime = new Date(
        expirationTime.getTime() + ONE_DAY_AS_MILLISECONDS
      );
    }
    return expirationTime.toISOString().substring(0, 10);
  }
 */

  public getRemainingTime(expirationTime: string): { days: number; hours: number; minutes: number } {
    if (expirationTime) {
      const remainingTime = new Date(expirationTime).getTime() - new Date().getTime();

      if (remainingTime < 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
        };
      }

      // const timeOffset = new Date(remainingTime).getTimezoneOffset();
      const remainingTimeAfterOffset = remainingTime + ONE_MIN_AS_MILLISECONDS; // +1 min for displaying purpose.
      const days = Math.floor(remainingTimeAfterOffset / ONE_DAY_AS_MILLISECONDS);
      const hours = Math.floor((remainingTimeAfterOffset - days * ONE_DAY_AS_MILLISECONDS) / ONE_HOUR_AS_MILLISECONDS);
      const minutes = Math.floor(
        (remainingTimeAfterOffset - days * ONE_DAY_AS_MILLISECONDS - hours * ONE_HOUR_AS_MILLISECONDS) / ONE_MIN_AS_MILLISECONDS
      );
      return {
        days,
        hours,
        minutes,
      };
    }
    return {
      days: 0,
      hours: 0,
      minutes: 0,
    };
  }

  getSafeUrl(localUrl: string): SafeUrl {
    return this._sanitizer.bypassSecurityTrustUrl(Capacitor.convertFileSrc(localUrl));
  }
  getSantinizerSecureUrl(localUrl: string): SafeUrl {
    return this._sanitizer.bypassSecurityTrustUrl(localUrl);
  }

  public async showAlertInvalid(): Promise<void> {
    const INVALID_BOOK = await this._translateService.get('HOME.LIBRARY.BOOK.DETAIL.ALERTS.INVALID_BOOK').toPromise();
    const warningAlert = await this._alertCtrl.create({
      header: INVALID_BOOK.title,
      message: INVALID_BOOK.message,
      cssClass: 'warning-alert',
    });
    await warningAlert.present();
  }

  public async showAlertNoInternet(): Promise<void> {
    const NO_INTERNET_CONNECTION = await this._translateService.get('HOME.LIBRARY.BOOK.DETAIL.ALERTS.NO_INTERNET_CONNECTION').toPromise();
    const warningAlert = await this._alertCtrl.create({
      header: NO_INTERNET_CONNECTION.title,
      message: NO_INTERNET_CONNECTION.message,
      cssClass: 'warning-alert',
    });
    await warningAlert.present();
    this._navCtrl.back();
  }

  public sendExtendRequest(id: string, endDate: string) {
    return this._apiService.extendBookById(id, endDate).pipe(map(({ success }) => success));
  }

  public sendCancelReserveRequest(id: string) {
    return this._apiService.toggleReserveById(id, true);
  }

  download(subject: BehaviorSubject<DownloadMediaDetailStateModel>): Observable<boolean> {
    const downloadingSubject = this._downloadingService.addSubject(subject, DownloadType.MEDIA);
    const state = downloadingSubject.value;
    const { id } = state.item;

    const updateDownloadingSubject = () => {
      const noteInStore = this._store.selectSnapshot(LibraryState.getDownloadedMediaById({ id }));
      downloadingSubject.next(noteInStore);
    };
    return this._store.dispatch(
      new DownloadItem({
        downloadType: DownloadType.MEDIA,
        item: state.item,
        onProgress: updateDownloadingSubject,
        onComplete: () => {
          updateDownloadingSubject();
          this._downloadingService.removeSubject(DownloadType.MEDIA, id);
        },
      })
    );
  }
  public async getPreviewURL(state: DownloadMediaDetailStateModel): Promise<LocalPath> {
    const { id } = state;
    const fileName = `${id}-preview.${getFileExtension(state.item.mediaType)}`;

    const transfer = this._fileTransfer.create();
    const audio = await transfer.download(state.item.previewUrl, this._getLocalDirectory() + fileName);
    if (audio) {
      return { directory: this._getLocalDirectory(), name: fileName };
    }
    return null;
  }

  private _getLocalDirectory(): string {
    if (this._platform.is('ios')) {
      return this._file.documentsDirectory;
    }
    if (this._platform.is('android')) {
      return this._file.dataDirectory;
    }
    return __dirname + '/';
  }

  public async removeFile(path: LocalPath): Promise<boolean> {
    if (path) {
      const { directory, name } = path;
      try {
        await this._file.removeFile(directory, name);
      } catch (err) {
        console.warn(err);
      }
    }

    return true;
  }

  public async getFileContent(path: LocalPath): Promise<ArrayBuffer> {
    if (this._electronService.isElectronApp) {
      const fileSystem = await window.require('fs');
      return fileSystem.readFileSync(`${path.directory}${path.name}`, {}).buffer;
    }
    let url = Capacitor.convertFileSrc(`${path.directory}${path.name}`);
    const result = await fetch(url);
    return await result.arrayBuffer();
  }

  public async writeDecryptedFile(decryptedContent: Blob, fileName: string): Promise<boolean> {
    const localDirectory = this._getLocalDirectory();
    const tempDirectory = `${localDirectory}${DirectoryNames.TEMPS}/`;
    const path = tempDirectory + fileName;
    try {
      if (this._electronService.isElectronApp) {
        const fileSystem = await window.require('fs');
        await fileSystem.promises.mkdir(tempDirectory, { recursive: true });
        await fileSystem.promises.writeFile(path, new Uint8Array(await (decryptedContent as any).arrayBuffer()), { flag: 'w' });

        return true;
      }

      await writeFile({
        path: path,
        blob: decryptedContent,
        recursive: true,
      });

      return true;
    } catch (err) {
      return this.writeDecryptedFileByBase64(decryptedContent, fileName);
    }
  }
  public async writeDecryptedFileByBase64(decryptedContent: string | Blob, fileName: string): Promise<boolean> {
    const localDirectory = this._getLocalDirectory();
    const tempDirectory = `${localDirectory}${DirectoryNames.TEMPS}/`;
    try {
      await this._file.createFile(tempDirectory, fileName, true);
      await this._file.writeFile(tempDirectory, fileName, decryptedContent, {
        append: false,
        replace: true,
      });
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  public async decryptToBlob(source: ArrayBuffer, key: string, isVideo: boolean): Promise<Blob> {
    const MAGIC_INDEX = 10;
    const uint8arrayToString = (uint8array: Uint8Array) => new TextDecoder('UTF-8').decode(uint8array);

    const uint8Array = new Uint8Array(source);
    const numberOfBytesRead = parseInt(uint8arrayToString(uint8Array.slice(0, MAGIC_INDEX)), 10);
    // Encrypted string
    const lastIndexEncrypted = MAGIC_INDEX + numberOfBytesRead;
    const encryptedString = uint8arrayToString(uint8Array.slice(MAGIC_INDEX, lastIndexEncrypted));

    // Decrypt encryptedString
    const decryptedWordArray = CryptoJS.AES.decrypt(encryptedString, key);

    const decryptedBase64 = decryptedWordArray.toString(CryptoJS.enc.Utf8);

    const uint8DecryptedArray = new Uint8Array(Base64ArrayBuffer.decode(decryptedBase64));

    return isVideo
      ? await new Blob([uint8DecryptedArray, uint8Array.slice(lastIndexEncrypted)], { type: 'video/mp4' })
      : await new Blob([uint8DecryptedArray, uint8Array.slice(lastIndexEncrypted)]);
  }
  public getDecryptedFilePath(path: LocalPath): LocalPath {
    const localDirectory = this._getLocalDirectory();
    const tempDirectory = `${localDirectory}${DirectoryNames.TEMPS}/`;

    return { directory: tempDirectory, name: path.name };
  }
}

/*
interface GetDateParams {
  min?: Date;
  max?: Date;
  minMessage?: string;
  maxMessage?: string;
}
*/

export const ONE_MIN_AS_MILLISECONDS = 60000;
export const ONE_HOUR_AS_MILLISECONDS = 60 * 60000;
export const ONE_DAY_AS_MILLISECONDS = 24 * 60 * 60000;
