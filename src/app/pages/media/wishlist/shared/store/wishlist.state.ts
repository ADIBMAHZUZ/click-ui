import { State, Selector, StateContext, Action } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { LoadFavoriteByMediaType } from './wishlist.actions';
import { WishlistStateModel } from '../models';
import { APIService } from '../services';
import { tap } from 'rxjs/operators';

const defaultState: WishlistStateModel = {
  book: null,
  audio: null,
  video: null,
};

@Injectable({ providedIn: 'root' })
@State<WishlistStateModel>({
  name: 'wishlist',
  defaults: defaultState,
})
export class WishlistState {
  constructor(private _apiService: APIService) {}

  @Selector()
  static getBook(state: WishlistStateModel) {
    return state.book;
  }
  @Selector()
  static getAudio(state: WishlistStateModel) {
    return state.audio;
  }
  @Selector()
  static getVideo(state: WishlistStateModel) {
    return state.video;
  }

  @Action(LoadFavoriteByMediaType)
  loadFavoriteByMediaType(
    { patchState }: StateContext<WishlistState>,
    { payload }: LoadFavoriteByMediaType
  ) {
    const mediaType = payload.mediaType;
    return this._apiService.getFavoriteByMediaType(mediaType).pipe(
      tap((favorite) =>
        patchState({
          [mediaType]: favorite,
        })
      )
    );
  }
}
