import { Paging } from 'src/app/core/models';
import { MediaDetailViewModel } from 'src/app/pages/home/library/shared/models';

export interface AllMediaFavoriteViewModel
  extends Paging<MediaDetailViewModel> {}

export interface MediaFavoriteViewModel {
  success: boolean;
  media: MediaDetailViewModel;
}
