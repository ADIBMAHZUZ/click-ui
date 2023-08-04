import { Options } from 'electron-dl';

export enum CLC_EVENTS {
  DOWNLOAD = 'clc-download',
  DOWNLOADING = 'clc-downloading',
  DOWNLOADED = 'clc-downloaded',
  CANCEL_DOWNLOAD = 'clc-cancel-download',
}

export interface ClcDownloadOptions {
  id: string;
}
export interface DownloadInfo {
  url: string;
  downloadOptions?: Options;
  clcOptions?: ClcDownloadOptions;
}
export interface DownloadingInfo {
  totalSize: number;
  downloadedSize: number;
  clcOptions?: ClcDownloadOptions;
}

export interface DownloadedInfo {
  path: string;
  clcOptions?: ClcDownloadOptions;
}
