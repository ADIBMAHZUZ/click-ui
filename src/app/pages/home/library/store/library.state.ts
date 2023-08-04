import { State, Selector, Action, StateContext, Store, createSelector } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import { LibraryStateModel, initialState } from './library-state.model';
import {
  LoadMediasByType,
  LoadMediasByTypeAndCategoryId,
  LoadMediasByTypeAndCategoryIdNext,
  LoadSelectedMedia,
  LoadSelectedMediaOffline,
  Downloading,
  DownloadAllMedias,
  ResetMediaListingOffline,
  ResetMediaSeeAll,
  ResetSelectedMedia,
  LoadMediasByTypeAndCategoryIdOffline,
  LoadMediasByTypeOffline,
  UpdateDownloadedMedias,
  ToggleLikeMediaById,
  LoadRelatedMedias,
  ReturnMediaById,
  BorrowMediaById,
  ToggleReserveMediaById,
  Downloaded,
  RemoveCurrent,
  ExtendMedia,
} from './library.actions';
import { LibraryMediaService } from '../shared/services/api.service';
import { tap, switchMap, mapTo, take, filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NetworkService } from '@core-services';
import {
  DownloadStateModel,
  DownloadState,
  DownloadType,
  getId,
  UpdateItem,
  PrepareToDownload,
  RemoveItem,
  UpdateItems,
  AddItems,
  RemoveItems,
} from 'src/app/shared/download';
import { MediaType } from 'src/app/core/models';
import { isEquals } from 'src/app/shared/utils';
import { MediasByCategoryViewModel, CategoriesViewModel, MediaDetailViewModel } from '../shared';

@State<LibraryStateModel>({
  name: 'library',
  defaults: initialState,
})
@Injectable()
export class LibraryState {
  constructor(private _apiService: LibraryMediaService, private _store: Store, private _network: NetworkService) {}

  @Selector()
  static getSeeAll(state: LibraryStateModel) {
    return state.seeAll;
  }

  @Selector()
  static getSelectedMedia(state: LibraryStateModel) {
    return state.selectedMedia;
  }

  @Selector()
  static getSelectedRelatedMedias(state: LibraryStateModel) {
    return state.relatedMedias;
  }

  static getListing(mediaType: MediaType, isInMyMedia: boolean) {
    return createSelector([LibraryState], (state: LibraryStateModel) => (isInMyMedia ? state.listing.offline : state.listing[mediaType]));
  }

  static getDownloadedMediaById({ id }) {
    const generatedId = getId(DownloadType.MEDIA, id);
    return createSelector([DownloadState], (state: DownloadStateModel) => state.downloaded.medias[generatedId]);
  }

  static getDownloadedMediasByType(payload: { mediaType: MediaType; categoryId?: string; query: string }) {
    return createSelector([DownloadState], (state: DownloadStateModel) => {
      const mediasAsArray = Object.values(state.downloaded.medias);

      return mediasAsArray.filter((media) => {
        const isSuitableMediaType = media.item.mediaType === payload.mediaType;
        const isSuitableCategoryId = payload.categoryId ? media.item.category.some((cate) => cate.id == payload.categoryId) : true;
        const isSuitableQuery = payload.query ? media.item.name.toLowerCase().includes(payload.query.toLowerCase()) : true;
        return isSuitableMediaType && isSuitableCategoryId && isSuitableQuery;
      });
    });
  }

  @Action(LoadMediasByType, { cancelUncompleted: true })
  loadMediasByType({ getState, patchState }: StateContext<LibraryStateModel>, { payload }: LoadMediasByType) {
    const { query, mediaType } = payload;
    return this._apiService.getMediasByMediaType(mediaType, query).pipe(
      tap((medias) => {
        const { listing } = getState();
        if (isEquals(listing[mediaType], medias)) {
          return;
        }
        patchState({ listing: { ...listing, [mediaType]: medias } });
      })
    );
  }

  @Action(LoadMediasByTypeAndCategoryId, { cancelUncompleted: true })
  loadMediaByTypeAndCategoryId({ getState, patchState }: StateContext<LibraryStateModel>, { payload }: LoadMediasByTypeAndCategoryId) {
    return this._apiService.getMediasByCategoryId(payload.id, payload.mediaType, payload.query).pipe(
      tap((medias) => {
        const { seeAll } = getState();
        if (isEquals(seeAll, medias)) {
          return;
        }
        patchState({ seeAll: medias });
      })
    );
  }

  @Action(LoadMediasByTypeAndCategoryIdNext, { cancelUncompleted: true })
  loadMediaByTypeAndCategoryIdNext(
    { getState, patchState }: StateContext<LibraryStateModel>,
    { payload }: LoadMediasByTypeAndCategoryIdNext
  ) {
    return this._apiService.getMediasByCategoryIdMore(payload.url).pipe(
      tap((medias) => {
        const curSeeAll = getState().seeAll;
        medias.media.results = curSeeAll.media.results.concat(medias.media.results);
        patchState({
          seeAll: medias,
        });
      })
    );
  }

  @Action(LoadSelectedMedia, { cancelUncompleted: true })
  loadSelectedMedia({ patchState }: StateContext<LibraryStateModel>, { payload }: LoadSelectedMedia) {
    const { id } = payload;
    return this._apiService.getMediaById(id).pipe(
      tap((state) => {
        patchState({
          selectedMedia: state,
        });
      })
    );
  }

  @Action(LoadSelectedMediaOffline, { cancelUncompleted: true })
  loadSelectedMediaOffline({ patchState, dispatch }: StateContext<LibraryStateModel>, { payload }: LoadSelectedMediaOffline) {
    const { id } = payload;
    if (this._network.isConnected()) {
      return this._apiService.getMediaById(id).pipe(
        switchMap((newestState) => {
          if (!newestState) {
            return throwError(null);
          }

          const downloadedMedia = this._store.selectSnapshot(LibraryState.getDownloadedMediaById({ id }));
          if (downloadedMedia) {
            return dispatch(
              new UpdateItem({
                downloadType: DownloadType.MEDIA,
                id: id,
                item: newestState.item,
              })
            ).pipe(mapTo(this._store.selectSnapshot(LibraryState.getDownloadedMediaById({ id }))));
          }

          return of(newestState);
        }),
        tap((downloadedState) => {
          patchState({
            selectedMedia: downloadedState,
          });
        })
      );
    }
    const state = this._store.selectSnapshot(LibraryState.getDownloadedMediaById({ id: payload.id }));
    patchState({
      selectedMedia: state,
    });
  }

  @Action(DownloadAllMedias)
  downloadAllMedias(context: StateContext<LibraryStateModel>) {
    return this._apiService.getDownloadedMedias().pipe(
      take(1),
      tap((response) => {
        for (const media of response.results) {
          if (media) {
            context.dispatch(
              new PrepareToDownload({
                item: media,
                downloadType: DownloadType.MEDIA,
              })
            );
          }
        }
      })
    );
  }

  @Action(ResetMediaListingOffline)
  resetMediaListing({ getState, patchState }: StateContext<LibraryStateModel>) {
    const { listing } = getState();
    patchState({
      listing: {
        ...listing,
        offline: null,
      },
    });
  }
  @Action(ResetMediaSeeAll)
  resetMediaSeeAll({ patchState }: StateContext<LibraryStateModel>) {
    patchState({ seeAll: null });
  }
  @Action(ResetSelectedMedia)
  resetSelectedMedia({ patchState }: StateContext<LibraryStateModel>) {
    patchState({ selectedMedia: null });
  }

  @Action(LoadMediasByTypeOffline, { cancelUncompleted: true })
  loadMediasByTypeOffline({ getState, patchState }: StateContext<LibraryStateModel>, { payload }: LoadMediasByTypeOffline) {
    const { listing } = getState();
    const sampleCategories: CategoriesViewModel = {
      lastest: null,
      categories: [],
    };
    const downloadedMedias = this._store.selectSnapshot(
      LibraryState.getDownloadedMediasByType({
        mediaType: payload.mediaType,
        query: payload.query,
      })
    );
    downloadedMedias?.forEach((media) => {
      media.item.category.forEach((category) => {
        const localCategory = sampleCategories.categories.find((cate) => cate.category.id == category.id);
        if (localCategory) {
          localCategory.media.push(media.item);
        } else {
          sampleCategories.categories.push({
            category: {
              id: category.id,
              name: category.name,
            },
            media: [media.item],
          });
        }
      });
    });
    patchState({
      listing: { ...listing, offline: sampleCategories },
    });
  }

  @Action(LoadMediasByTypeAndCategoryIdOffline, { cancelUncompleted: true })
  loadMediaByTypeAndCategoryIdOffline({ patchState }: StateContext<LibraryStateModel>, { payload }: LoadMediasByTypeAndCategoryIdOffline) {
    const { id, mediaType, query } = payload;
    const sampleCategory: MediasByCategoryViewModel = {
      category: null,
      media: {
        count: 0,
        previous: null,
        next: null,
        results: [],
      },
    };

    const downloadedMedias = this._store.selectSnapshot(
      LibraryState.getDownloadedMediasByType({
        mediaType: mediaType,
        categoryId: id,
        query,
      })
    );
    downloadedMedias?.forEach((media) => {
      if (!sampleCategory.category) {
        media.item.category.forEach((category) => {
          if (sampleCategory.category) {
            return;
          }
          if (category.id == id) {
            sampleCategory.category = {
              id: category.id,
              name: category.name,
            };
          }
        });
      }
      sampleCategory.media.results.push(media.item);
    });

    patchState({
      seeAll: sampleCategory,
    });
  }

  @Action(UpdateDownloadedMedias)
  updateDownloadedMedias({ dispatch }: StateContext<LibraryStateModel>) {
    if (!this._network.isConnected()) {
      return;
    }
    const downloadedMedias = this._store.selectSnapshot(DownloadState.getDownloadedMedias);
    return this._apiService.getDownloadedMedias().pipe(
      take(1),
      tap((medias) => {
        const downloadedKeys = Object.keys(downloadedMedias);
        const downloadedExtractKeys = downloadedKeys.map((key) => key.slice(3));
        const updatedItems: MediaDetailViewModel[] = [];
        const addedItems: MediaDetailViewModel[] = [];

        for (const mediaFromServer of medias.results) {
          const id = mediaFromServer.id.toString();
          const indexOfKeyInDownloaded = downloadedExtractKeys.indexOf(id);

          if (indexOfKeyInDownloaded > -1) {
            updatedItems.push(mediaFromServer);
            downloadedExtractKeys.splice(indexOfKeyInDownloaded, 1);
          } else {
            addedItems.push(mediaFromServer);
          }
        }
        const willUpdateItems = updatedItems.map((media) => ({
          id: media.id,
          item: media,
          downloadType: DownloadType.MEDIA,
        }));
        dispatch(new UpdateItems(willUpdateItems));

        const willAddItems = addedItems.map((media) => ({
          item: media,
          downloadType: DownloadType.MEDIA,
        }));
        dispatch(new AddItems(willAddItems));

        const willRemoveItems = downloadedExtractKeys.map((key) => ({
          id: key,
          downloadType: DownloadType.MEDIA,
        }));
        dispatch(new RemoveItems(willRemoveItems));
      })
    );
  }

  @Action(ToggleLikeMediaById)
  toggleLikeMediaById({ patchState, getState }: StateContext<LibraryStateModel>) {
    const { selectedMedia } = getState();
    if (!selectedMedia) {
      return;
    }
    const { id } = selectedMedia;
    const { favorite, numberOfFavorites } = selectedMedia.item;
    patchState({
      selectedMedia: {
        ...selectedMedia,
        item: {
          ...selectedMedia.item,
          favorite: !favorite,
          numberOfFavorites: favorite ? numberOfFavorites - 1 : numberOfFavorites + 1,
        },
      },
    });
    const request = favorite ? this._apiService.deleteFavoriteById(id) : this._apiService.addFavoriteById(id);
    return request.pipe(
      filter(({ success }) => success),
      tap(({ media }) =>
        patchState({
          selectedMedia: {
            ...selectedMedia,
            item: media,
          },
        })
      )
    );
  }

  @Action(LoadRelatedMedias)
  loadRelatedMedias({ patchState, getState }: StateContext<LibraryStateModel>) {
    const id = getState().selectedMedia?.item?.id;
    if (id) {
      return this._apiService.getRelatedMedia(id).pipe(tap((relatedMedias) => patchState({ relatedMedias })));
    }
  }
  @Action(ReturnMediaById)
  returnMediaById(_, { id }: ReturnMediaById) {
    if (id) {
      return this._apiService.returnBookById(id);
    }
  }
  @Action(BorrowMediaById)
  borrowMediaById(_, { payload }: BorrowMediaById) {
    const { id, expirationTime } = payload;
    if (id) {
      return this._apiService.borrowBookById(id, expirationTime);
    }
  }
  @Action(ExtendMedia)
  extendMedia({ getState }: StateContext<LibraryStateModel>, { payload }: ExtendMedia) {
    const { selectedMedia } = getState();
    if (selectedMedia.item) {
      const { id } = selectedMedia.item;
      return this._apiService.extendBookById(id, payload.expirationTime);
    }
  }
  @Action(ToggleReserveMediaById)
  toggleReserveMediaById(_, { payload }: ToggleReserveMediaById) {
    const { id, isCancelled } = payload;
    if (id) {
      return this._apiService.toggleReserveById(id, isCancelled);
    }
  }
  @Action(Downloading)
  downloading({ patchState, getState }: StateContext<LibraryStateModel>, { payload }: Downloading) {
    const { selectedMedia } = getState();
    if (selectedMedia) {
      patchState({ selectedMedia: { ...selectedMedia, downloading: payload } });
    }
  }
  @Action(Downloaded)
  downloaded({ patchState, getState }: StateContext<LibraryStateModel>, { payload }: Downloaded) {
    const { selectedMedia } = getState();
    if (selectedMedia?.item.id === payload.id) {
      patchState({
        selectedMedia: {
          ...selectedMedia,
          path: payload.path,
          downloading: null,
          downloaded: true,
          error: null,
        },
      });
    }
  }
  @Action(RemoveCurrent)
  removeCurrent({ patchState, getState, dispatch }: StateContext<LibraryStateModel>) {
    const { selectedMedia } = getState();
    patchState({
      selectedMedia: {
        ...selectedMedia,
        downloaded: false,
        downloading: null,
        path: null,
      },
    });
    dispatch(new RemoveItem({ id: selectedMedia.item.id, downloadType: DownloadType.MEDIA }));
  }
}
