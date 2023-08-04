import { Paging } from 'src/app/core/models/others/index';
import { MediaType } from 'src/app/core/models/others';
import { BorrowErrorCodes } from './others.model';
import { DownloadDetailState } from 'src/app/shared/download/models/download-detail-state.model';

export interface DownloadedMediasViewModel {
  results: Array<MediaDetailViewModel>;
}

export interface BorrowErrorableViewModel {
  error: string;
  code: BorrowErrorCodes;
  success: boolean;
}

export interface MediaDetailViewModel {
  id: string;
  name: string;
  publisher?: PublisherViewModel;
  category?: CategoryViewModel[];
  duration?: string;
  author?: string;
  fileSize?: number;
  encryptKey?: string;
  formatType?: string;
  mediaType?: MediaType;
  numberOfDownload?: number;
  url?: string;
  previewUrl?: string;
  maxPreview?: number;
  thumbnail: string;
  encryptInfo?: string;
  nameEncrypt?: string;
  nameBackup?: string;
  isbn?: string;
  images?: {
    id: string;
    image: string;
    thumbnail: string;
  }[];
  expirationTime?: string;
  maxDownload?: number;
  quantity?: number;
  favorite?: boolean;
  numberOfFavorites?: number;
  isBorrowed?: boolean;
  remainingBorrowTimes?: number;
  reservedIndex?: number;
  subscriber_media?: {
    id?: string | number;
    media?: number;
    subscriber?: number;
    max_download?: number;
    library_media?: number;
    expiration_time?: string;
  };
}
export interface PublisherViewModel {
  id: string;
  username: string;
  email: string;
  name: string;
  shortName: string;
  address: string;
  phone: number;
  logo: string;
  isActive: boolean;
  userType: string;
}
export interface CategoryViewModel {
  id: string;
  name: string;
  nameMalay: string;
  description: string;
  categoryType: number;
  isActive: boolean;
}

export interface CategoriesViewModel {
  lastest: MediaDetailViewModel[];
  categories: {
    category: {
      id: string;
      name: string;
    };
    media: MediaDetailViewModel[];
  }[];
}

export interface MediasByCategoryViewModel {
  category: {
    id: string;
    name: string;
  };
  media: Paging<MediaDetailViewModel>;
}

export interface AllMediaFavoriteViewModel extends Paging<MediaDetailViewModel> {}

export interface MediaFavoriteViewModel {
  success: boolean;
  media: MediaDetailViewModel;
}

export interface MediaRelatedViewModel {
  results: MediaRelatedDetailViewModel[];
}

export interface MediaRelatedDetailViewModel {
  id: string;
  name: string;
  thumbnail: string;
  mediaType: MediaType;
}

export interface DownloadMediaDetailStateModel extends DownloadDetailState<MediaDetailViewModel> {}
