import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { CLC_EVENTS, DownloadInfo, DownloadingInfo, DownloadedInfo } from '../models/others/electron.model';

@Injectable({
  providedIn: 'root',
})
export class DownloadElectronService {
  constructor(private electron: ElectronService) {}

  download(downloadInfo: DownloadInfo, onProgress: Function) {
    return new Promise<DownloadedInfo>((resolve) => {
      const { ipcRenderer } = this.electron;
      const downloadingListener = (_, info: DownloadingInfo) => {
        onProgress(info);
      };
      const downloadedListener = (_, info: DownloadedInfo) => {
        resolve(info);
      };
      ipcRenderer.addListener(CLC_EVENTS.DOWNLOADING, downloadingListener);
      ipcRenderer.addListener(CLC_EVENTS.DOWNLOADED, downloadedListener);
      ipcRenderer.send(CLC_EVENTS.DOWNLOAD, downloadInfo);
    });
  }
}
