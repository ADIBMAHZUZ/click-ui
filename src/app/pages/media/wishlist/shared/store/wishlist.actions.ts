import { MediaType } from 'src/app/core/models';

const enum Actions {
  LoadFavoriteByMediaType = '[Wishlist] Load Favorite By Media Type',
}

export class LoadFavoriteByMediaType {
  static readonly type = Actions.LoadFavoriteByMediaType;
  constructor(public readonly payload: { mediaType: MediaType }) {}
}
