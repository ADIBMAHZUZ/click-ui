import { MediaType } from '../others';
import { Paging } from '../others/index';
export interface DownloadedMaterialResponse {
  results: Array<MaterialDetailType>;
}
export interface LibrarianResponse {
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
  library: number;
  max_subscribers: number;
}
export interface MaterialCategoryResponse {
  id: string;
  name: string;
  name_malay: string;
  description: string;
  category_type: number;
  is_active: boolean;
}

export interface MaterialDetailType {
  id: string;
  name: string;
  library: LibrarianResponse;
  category: MaterialCategoryResponse;
  duration: string;
  author: string;
  file_size: number;
  format_type: string;
  media_type: MediaType;
  url: string;
  thumbnail: string;
  is_active: true;
  isbn?: string;
  is_borrowed: boolean;
  images: {
    id: string;
    image: string;
    thumbnail: string;
    media: number;
  }[];
  number_of_download: number;
  published_date: string;
}

export interface MaterialCategoriesResponse {
  results: {
    categories: {
      category: {
        id: string;
        name: string;
      };
      media: MaterialDetailType[];
    }[];
  };
}

export interface MaterialByCategoryResponse {
  results: {
    category: {
      id: string;
      name: string;
    };
    media: Paging<MaterialDetailType>;
  };
}

export interface MaterialDetailResponse {
  results: MaterialDetailType;
}
