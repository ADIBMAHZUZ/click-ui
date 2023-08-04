export interface Options {
  readonly saveAs?: boolean;
  readonly directory?: string;
  readonly filename?: string;
}

export enum CLC_EVENTS {
  DOWNLOAD = 'clc-download',
  DOWNLOADING = 'clc-downloading',
  DOWNLOADED = 'clc-downloaded',
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
