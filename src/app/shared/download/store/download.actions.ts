import { FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { DownloadType, DownloadableType } from '../models/download-type.model';

const enum Actions {
  DOWNLOADING = '[Download] Downloading',
  DOWNLOADED = '[Download] Downloaded',
  PREPARE_TO_DOWNLOAD = '[Download] Prepare to Download',
  UPDATE_ITEM = '[Download] Update Item',
  UPDATE_ITEMS = '[Download] Update Items',
  ADD_ITEM = '[Download] Add Item',
  ADD_ITEMS = '[Download] Add Items',
  REMOVE_ITEM = '[Download] Remove Item',
  REMOVE_ITEMS = '[Download] Remove Items',
  DOWNLOAD_ITEM = '[Download] Download Item',
  CREATE_DOWNLOAD_FOLDERS = '[Download] Create Download Folders',
}

export class Downloading {
  static readonly type: string = Actions.DOWNLOADING;
  constructor(
    public readonly payload: {
      id: string;
      downloadType: DownloadType;
      totalSize: number;
      downloadedSize: number;
      transferStream?: FileTransferObject;
    }
  ) {}
}

export class Downloaded {
  static readonly type: string = Actions.DOWNLOADED;
  constructor(
    public readonly payload: {
      id: string;
      downloadType: DownloadType;
      directory: string;
      name: string;
      mediaName: string;
    }
  ) {}
}

export class PrepareToDownload {
  static readonly type: string = Actions.PREPARE_TO_DOWNLOAD;
  constructor(public readonly payload: { downloadType: DownloadType; item: DownloadableType }) {}
}
export class UpdateItem {
  static readonly type: string = Actions.UPDATE_ITEM;
  constructor(public readonly payload: { id: string; downloadType: DownloadType; item: DownloadableType }) {}
}

export class AddItem {
  static readonly type: string = Actions.ADD_ITEM;
  constructor(public readonly payload: { downloadType: DownloadType; item: DownloadableType }) {}
}

export class RemoveItem {
  static readonly type: string = Actions.REMOVE_ITEM;
  constructor(public readonly payload: { downloadType: DownloadType; id: string }) {}
}

export class DownloadItem {
  static readonly type: string = Actions.DOWNLOAD_ITEM;
  constructor(
    public readonly payload: {
      downloadType: DownloadType;
      item: DownloadableType;
      onProgress?: () => void;
      onComplete?: () => void;
    }
  ) {}
}
export class CreateFolders {
  static readonly type: string = Actions.CREATE_DOWNLOAD_FOLDERS;
}

export class UpdateItems {
  static readonly type: string = Actions.UPDATE_ITEMS;
  constructor(public readonly payload: { id: string; downloadType: DownloadType; item: DownloadableType }[]) {}
}

export class AddItems {
  static readonly type: string = Actions.ADD_ITEMS;
  constructor(public readonly payload: { downloadType: DownloadType; item: DownloadableType }[]) {}
}

export class RemoveItems {
  static readonly type: string = Actions.REMOVE_ITEMS;
  constructor(public readonly payload: { downloadType: DownloadType; id: string }[]) {}
}
