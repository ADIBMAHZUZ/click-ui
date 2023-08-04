import { Paging } from 'src/app/core/models';
import { MediaDetailType } from 'src/app/pages/home/library/shared/models';

export interface AllMediaFavoriteResponse extends Paging<MediaDetailType> {}

export interface MediaFavoriteResponse {
  success: boolean;
  media: MediaDetailType;
}
