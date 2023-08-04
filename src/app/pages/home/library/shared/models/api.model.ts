import { Paging } from 'src/app/core/models/others/index';
import { MediaType } from 'src/app/core/models/others';
import { BorrowErrorCodes } from './others.model';

export interface DownloadedMediasResponse {
  results: Array<MediaDetailType>;
}

export interface BorrowErrorableResponse {
  error: string;
  code: BorrowErrorCodes;
  success: boolean;
}

export interface MediaDetailResponse {
  results: MediaDetailType;
}
export interface MediaDetailType {
  id: string;
  name: string;
  publisher?: PublisherResponse;
  category?: CategoryResponse[];
  duration?: string;
  author?: string;
  file_size?: number;
  format_type?: string;
  media_type?: MediaType;
  number_of_download?: number;
  url?: string;
  preview_url?: string;
  max_preview?: number;
  thumbnail: string;
  encrypt_info?: string;
  encrypt_key?: string;
  name_encrypt?: string;
  name_backup?: string;
  isbn?: string;
  images?: {
    id: string;
    image: string;
    thumbnail: string;
  }[];
  quantity?: number;
  favorite?: boolean;
  number_of_favorites?: number;
  subscriber_media?: {
    id?: string | number;
    media?: number;
    subscriber?: number;
    max_download?: number;
    library_media?: number;
    expiration_time?: string;
  };
  is_borrowed?: boolean;
  remaining_borrow_times?: number;
  reserved_index?: number;
}

export interface PublisherResponse {
  id: string;
  username: string;
  email: string;
  name: string;
  short_name: string;
  address: string;
  phone: number;
  logo: string;
  is_active: boolean;
  user_type: string;
}
export interface CategoryResponse {
  id: string;
  name: string;
  name_malay: string;
  description: string;
  category_type: number;
  is_active: boolean;
}
export interface CategoriesResponse {
  results: {
    lastest: MediaDetailType[];
    categories: {
      category: {
        id: string;
        name: string;
      };
      media: MediaDetailType[];
    }[];
  };
}

export interface MediasByCategoryResponse {
  results: {
    category: {
      id: string;
      name: string;
    };
    media: Paging<MediaDetailType>;
  };
}

export interface AllMediaFavoriteResponse extends Paging<MediaDetailType> {}

export interface MediaFavoriteResponse {
  success: boolean;
  media: MediaDetailType;
}

export interface BorrowMediaRequestParams {
  expiration_time: string;
}

export interface MediaRelatedResponse {
  results: MediaRelatedDetailResponse[];
}

export interface MediaRelatedDetailResponse {
  id: string;
  name: string;
  media_type: MediaType;
  thumbnail: string;
}
