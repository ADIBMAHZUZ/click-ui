import { MediaType } from '../others';
import { Paging } from '../others/index';
import { DownloadDetailState } from 'src/app/shared/download/models/download-detail-state.model';
export interface DownloadedMaterialViewModel {
  results: Array<MaterialDetailViewModel>;
}
export interface LibrarianViewModel {
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
  library: number;
  maxSubscribers: number;
}

export interface MaterialCategoryViewModel {
  id: string;
  name: string;
  nameMalay: string;
  description: string;
  categoryType: number;
  isActive: boolean;
}

export interface MaterialDetailViewModel {
  id: string;
  name: string;
  library: LibrarianViewModel;
  category: MaterialCategoryViewModel;
  duration: string;
  author: string;
  fileSize: number;
  formatType: string;
  mediaType: MediaType;
  url: string;
  thumbnail: string;
  isActive: true;
  isbn?: string;
  isBorrowed: boolean;
  images: {
    id: string;
    image: string;
    thumbnail: string;
    media: number;
  }[];
  numberOfDownload: number;
  publishedDate: string;
}

export interface MaterialCategoriesViewModel {
  categories: {
    category: {
      id: string;
      name: string;
    };
    media: MaterialDetailViewModel[];
  }[];
}

export interface MaterialByCategoryViewModel {
  category: {
    id: string;
    name: string;
  };
  media: Paging<MaterialDetailViewModel>;
}

export interface DownloadMaterialDetailStateModel
  extends DownloadDetailState<MaterialDetailViewModel> {}
