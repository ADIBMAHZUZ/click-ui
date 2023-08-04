import { FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Bookmarkable } from 'src/app/core/models';
import { LocalPath } from 'src/app/pages/home/library/shared';

export interface DownloadDetailState<T> extends Bookmarkable {
  id: string;
  downloading: {
    downloadedSize: number;
    totalSize: number;
    transferStream: FileTransferObject;
  };
  downloaded: boolean;
  error: Error;
  path: LocalPath;
  item: T;
}

export const initialDownloadDetailState: DownloadDetailState<any> = {
  id: null,
  downloading: null,
  downloaded: false,
  path: null,
  error: null,
  item: null,
  bookmarks: [],
};

export const initialPrepareDetailState: DownloadDetailState<any> = {
  id: null,
  downloading: {
    downloadedSize: 0,
    totalSize: 1,
    transferStream: null,
  },
  downloaded: false,
  path: null,
  error: null,
  item: null,
  bookmarks: [],
};
