import { DownloadType } from '../models/download-type.model';

const enum Actions {
  ADD_BOOKMARK = '[Bookmark] Add Bookmark]',
  REMOVE_BOOKMARK = '[Bookmark] Remove Bookmark',
}
export class AddBookmark {
  static readonly type = Actions.ADD_BOOKMARK;
  constructor(
    public readonly payload: {
      id: string;
      downloadType: DownloadType;
      pageIndex: number;
    }
  ) {}
}
export class RemoveBookmark {
  static readonly type = Actions.REMOVE_BOOKMARK;
  constructor(
    public readonly payload: {
      id: string;
      downloadType: DownloadType;
      pageIndex: number;
    }
  ) {}
}
