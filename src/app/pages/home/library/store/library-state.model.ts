import { CategoriesViewModel, MediasByCategoryViewModel, DownloadMediaDetailStateModel, MediaRelatedViewModel } from '../shared/models';
import { MediaType } from 'src/app/core/models';

export interface LibraryStateModel {
  selectedMedia: DownloadMediaDetailStateModel;
  listing: {
    [MediaType.BOOK]: CategoriesViewModel;
    [MediaType.AUDIO]: CategoriesViewModel;
    [MediaType.VIDEO]: CategoriesViewModel;
    offline: CategoriesViewModel;
  };
  seeAll: MediasByCategoryViewModel;
  relatedMedias?: MediaRelatedViewModel;
}

export const initialState = {
  selectedMedia: null,
  listing: {
    [MediaType.BOOK]: null,
    [MediaType.AUDIO]: null,
    [MediaType.VIDEO]: null,
    offline: null,
  },
  seeAll: null,
};
