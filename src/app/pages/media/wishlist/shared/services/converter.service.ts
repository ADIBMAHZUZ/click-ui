import { Injectable } from '@angular/core';
import {
  MediaFavoriteResponse,
  MediaFavoriteViewModel,
  AllMediaFavoriteResponse,
  AllMediaFavoriteViewModel,
} from '../models';
import { Converter as MediaConverter } from 'src/app/pages/home/library/shared/services';

@Injectable({ providedIn: 'root' })
export class Converter {
  constructor(private _converter: MediaConverter) {}

  fromMediaFavoriteResponse__MediaFavoriteViewModel(
    mediaFavoriteResponse: MediaFavoriteResponse
  ): MediaFavoriteViewModel {
    const { success, media } = mediaFavoriteResponse;
    return {
      success,
      media: this._converter.fromMediaDetailType__MediaDetailViewModel(media),
    };
  }

  fromAllMediaFavoriteResponse__AllMediaFavoriteViewModel(
    allMediaFavoriteResponse: AllMediaFavoriteResponse
  ): AllMediaFavoriteViewModel {
    const { next, count, previous, results } = allMediaFavoriteResponse;
    return {
      next,
      count,
      previous,
      results: results.map((media) =>
        this._converter.fromMediaDetailType__MediaDetailViewModel(media)
      ),
    };
  }
}
