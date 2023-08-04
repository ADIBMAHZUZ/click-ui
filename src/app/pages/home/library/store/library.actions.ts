import { MediaType } from 'src/app/core/models';
import { LibraryStateModel } from './library-state.model';
const enum Actions {
  LOAD_MEDIAS_BY_TYPE = '[Library] Load Media By Media Type',
  LOAD_MEDIAS_BY_TYPE_OFFLINE = '[Library] Load Medias By Media Type Offline',
  LOAD_MEDIAS_BY_TYPE_AND_CATEGORY_ID = '[Library] Load Medias By Media Type And Category ID',
  LOAD_MEDIAS_BY_TYPE_AND_CATEGORY_ID_OFFLINE = '[Library] Load Medias By Media Type And Category ID Offline',
  LOAD_MEDIAS_BY_TYPE_AND_CATEGORY_ID_NEXT = '[Library] Load Medias By Media Type And Category ID Next',
  LOAD_SELECTED_MEDIA = '[Library] Load Selected Media',
  LOAD_SELECTED_MEDIA_OFFLINE = '[Library] Load Selected Media Offline',
  DOWNLOADING = '[Library] Downloading Media',
  DOWNLOADED = '[Library] Downloaded Media',
  DOWNLOAD_ALL_MEDIAS = '[Library] Download All Medias',
  RESET_MEDIA_LISTING_OFFLINE = '[Library] Reset Media Listing Offline',
  RESET_MEDIA_SEE_ALL = '[Library] Reset Media See All',
  RESET_SELECTED_MEDIA = '[Library] Reset Selected Media',
  UPDATE_DOWNLOADED_MEDIAS = '[Library] Update Downloaded Medias',
  TOGGLE_LIKE_MEDIA = '[Library] Toggle Like Media',
  LOAD_RELATED_MEDIAS = '[Library] Load Related Medias',
  RETURN_MEDIA_BY_ID = '[Library] Return Media By ID',
  BORROW_MEDIA_BY_ID = '[Library] Borrow Media By ID',
  EXTEND_MEDIA = '[Library] Extend Media',
  TOGGLE_RESERVE_MEDIA_BY_ID = '[Library] Toggle Reserve Media By ID',
  REMOVE_CURRENT_MEDIA = '[Library] Remove Current Media',
}

export class LoadMediasByType {
  static readonly type = Actions.LOAD_MEDIAS_BY_TYPE;
  constructor(
    public readonly payload: {
      mediaType: MediaType;
      query: string;
    }
  ) {}
}
export class LoadMediasByTypeOffline {
  static readonly type = Actions.LOAD_MEDIAS_BY_TYPE_OFFLINE;
  constructor(
    public readonly payload: {
      mediaType: MediaType;
      query: string;
    }
  ) {}
}

export class LoadMediasByTypeAndCategoryId {
  static readonly type = Actions.LOAD_MEDIAS_BY_TYPE_AND_CATEGORY_ID;
  constructor(
    public readonly payload: {
      id: string;
      mediaType: MediaType;
      query: string;
    }
  ) {}
}
export class LoadMediasByTypeAndCategoryIdOffline {
  static readonly type = Actions.LOAD_MEDIAS_BY_TYPE_AND_CATEGORY_ID_OFFLINE;
  constructor(
    public readonly payload: {
      id: string;
      mediaType: MediaType;
      query: string;
    }
  ) {}
}

export class LoadMediasByTypeAndCategoryIdNext {
  static readonly type = Actions.LOAD_MEDIAS_BY_TYPE_AND_CATEGORY_ID_NEXT;
  constructor(public readonly payload: { url: string }) {}
}

export class LoadSelectedMedia {
  static readonly type = Actions.LOAD_SELECTED_MEDIA;
  constructor(public readonly payload: { id: string }) {}
}
export class LoadSelectedMediaOffline {
  static readonly type = Actions.LOAD_SELECTED_MEDIA_OFFLINE;
  constructor(public readonly payload: { id: string }) {}
}
export class Downloading {
  static readonly type = Actions.DOWNLOADING;
  constructor(public readonly payload: LibraryStateModel['selectedMedia']['downloading']) {}
}
export class Downloaded {
  static readonly type = Actions.DOWNLOADED;
  constructor(public readonly payload: { id: string; path: LibraryStateModel['selectedMedia']['path'] }) {}
}
export class DownloadAllMedias {
  static readonly type: string = Actions.DOWNLOAD_ALL_MEDIAS;
}

export class ResetMediaListingOffline {
  static readonly type: string = Actions.RESET_MEDIA_LISTING_OFFLINE;
}

export class ResetMediaSeeAll {
  static readonly type: string = Actions.RESET_MEDIA_SEE_ALL;
}

export class ResetSelectedMedia {
  static readonly type: string = Actions.RESET_SELECTED_MEDIA;
}

export class UpdateDownloadedMedias {
  static readonly type: string = Actions.UPDATE_DOWNLOADED_MEDIAS;
}

export class ToggleLikeMediaById {
  static readonly type: string = Actions.TOGGLE_LIKE_MEDIA;
}

export class LoadRelatedMedias {
  static readonly type: string = Actions.LOAD_RELATED_MEDIAS;
}

export class ReturnMediaById {
  static readonly type: string = Actions.RETURN_MEDIA_BY_ID;
  constructor(readonly id: string) {}
}

export class BorrowMediaById {
  static readonly type: string = Actions.BORROW_MEDIA_BY_ID;
  constructor(readonly payload: { id: string; expirationTime: string }) {}
}

export class ToggleReserveMediaById {
  static readonly type: string = Actions.TOGGLE_RESERVE_MEDIA_BY_ID;
  constructor(readonly payload: { id: string; isCancelled: boolean }) {}
}

export class RemoveCurrent {
  static readonly type: string = Actions.REMOVE_CURRENT_MEDIA;
}

export class ExtendMedia {
  static readonly type: string = Actions.EXTEND_MEDIA;
  constructor(readonly payload: { expirationTime: string }) {}
}
