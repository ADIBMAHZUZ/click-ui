import { Injectable } from '@angular/core';
import {
  PublisherResponse,
  PublisherViewModel,
  CategoryResponse,
  CategoryViewModel,
  MediaDetailResponse,
  MediaDetailViewModel,
  DownloadedMediasResponse,
  DownloadedMediasViewModel,
  CategoriesResponse,
  CategoriesViewModel,
  MediasByCategoryResponse,
  MediasByCategoryViewModel,
  MediaDetailType,
  MediaFavoriteResponse,
  MediaFavoriteViewModel,
  AllMediaFavoriteResponse,
  AllMediaFavoriteViewModel,
  MediaRelatedResponse,
  MediaRelatedViewModel,
  MediaRelatedDetailResponse,
  MediaRelatedDetailViewModel,
  BorrowErrorableResponse,
  BorrowErrorableViewModel,
  DownloadMediaDetailStateModel,
} from '../models';
import { Store } from '@ngxs/store';
import { AuthState } from 'src/app/auth/store/auth.state';
import { initialDownloadDetailState } from 'src/app/shared/download/models/download-detail-state.model';

@Injectable({ providedIn: 'root' })
export class Converter {
  constructor(private _store: Store) {}

  fromPublisherResponse__PublisherViewModel(publisherResponse: PublisherResponse): PublisherViewModel {
    const {
      id,
      username,
      email,
      name,
      short_name,
      address,
      phone,
      logo,

      is_active,
      user_type,
    } = publisherResponse;
    return {
      id,
      username,
      email,
      name,
      shortName: short_name,
      address,
      phone,
      logo,
      isActive: is_active,
      userType: user_type,
    };
  }
  fromCategoryResponse__CategoryViewModel(categoryResponse: CategoryResponse): CategoryViewModel {
    const { id, name, name_malay, description, category_type, is_active } = categoryResponse;

    return {
      id,
      name,
      nameMalay: name_malay,
      description,
      categoryType: category_type,
      isActive: is_active,
    };
  }

  fromMediaDetailResponse__MediaDetailViewModel(mediaDetailResponse: MediaDetailResponse): MediaDetailViewModel {
    return this.fromMediaDetailType__MediaDetailViewModel(mediaDetailResponse.results);
  }

  fromMediaDetailResponse__DownloadMediaDetailStateModel(bookDetailResponse: MediaDetailResponse): DownloadMediaDetailStateModel {
    return {
      ...initialDownloadDetailState,
      id: bookDetailResponse.results.id,
      item: this.fromMediaDetailType__MediaDetailViewModel(bookDetailResponse.results),
    };
  }
  fromDownloadedMediasResponse__DownloadedMediasViewModel(downloadedBooksResponse: DownloadedMediasResponse): DownloadedMediasViewModel {
    const { results } = downloadedBooksResponse;
    const viewModelResults = results.map((bookDetailResponse) => {
      return this.fromMediaDetailResponse__MediaDetailViewModel({
        results: bookDetailResponse,
      });
    });
    return {
      results: viewModelResults,
    };
  }

  fromCategoriesResponse__CategoriesViewModel(categoriesResponse: CategoriesResponse): CategoriesViewModel {
    const { categories, lastest } = categoriesResponse.results;
    const categoriesVM = categories.map((category) => {
      return {
        category: category.category,
        media: category.media.map((media) => this.fromMediaDetailResponse__MediaDetailViewModel({ results: media })),
      };
    });
    const lastestVM = lastest.map((media) => this.fromMediaDetailResponse__MediaDetailViewModel({ results: media }));
    return {
      categories: categoriesVM,
      lastest: lastestVM,
    };
  }

  fromMediasByCategoryResponse_MediasByCategoryViewModel(bookByCategoryResponse: MediasByCategoryResponse): MediasByCategoryViewModel {
    const { results } = bookByCategoryResponse;
    const { category, media } = results;
    return {
      category,
      media: {
        count: media.count,
        next: media.next,
        previous: media.previous,
        results: media.results.map((mediaItem) =>
          this.fromMediaDetailResponse__MediaDetailViewModel({
            results: mediaItem,
          })
        ),
      },
    };
  }

  fromMediaDetailType__MediaDetailViewModel(mediaDetailType: MediaDetailType): MediaDetailViewModel {
    const {
      id,
      name,
      publisher,
      category,
      duration,
      author,
      file_size,
      encrypt_key,
      format_type,
      media_type,
      number_of_download,
      url,
      isbn,
      preview_url,
      max_preview,
      thumbnail,
      encrypt_info,
      name_encrypt,
      name_backup,
      images,
      subscriber_media,
      quantity,
      favorite,
      number_of_favorites,
      is_borrowed,
      remaining_borrow_times,
      reserved_index,
    } = mediaDetailType;
    const expirationTime: string = null;
    const maxDownload = this._store.selectSnapshot(AuthState.getUserInfo).maxDownload;

    return {
      id,
      name,
      publisher: publisher ? this.fromPublisherResponse__PublisherViewModel(publisher) : null,
      category: category ? category.map((cate) => this.fromCategoryResponse__CategoryViewModel(cate)) : null,
      duration,
      author,
      fileSize: file_size,
      encryptKey: encrypt_key,
      formatType: format_type,
      mediaType: media_type,
      numberOfDownload: number_of_download,
      url,
      previewUrl: preview_url,
      maxPreview: max_preview,
      thumbnail,
      encryptInfo: encrypt_info,
      nameEncrypt: name_encrypt,
      nameBackup: name_backup,
      isbn,
      images,
      expirationTime: subscriber_media ? subscriber_media.expiration_time : expirationTime,
      maxDownload: subscriber_media ? subscriber_media.max_download : maxDownload,
      quantity,
      favorite,
      numberOfFavorites: number_of_favorites,
      isBorrowed: is_borrowed,
      remainingBorrowTimes: remaining_borrow_times,
      reservedIndex: reserved_index,
      subscriber_media,
    };
  }
  fromMediaFavoriteResponse__MediaFavoriteViewModel(mediaFavoriteResponse: MediaFavoriteResponse): MediaFavoriteViewModel {
    const { success, media } = mediaFavoriteResponse;
    return {
      success,
      media: this.fromMediaDetailType__MediaDetailViewModel(media),
    };
  }
  fromAllMediaFavoriteResponse__AllMediaFavoriteViewModel(allMediaFavoriteResponse: AllMediaFavoriteResponse): AllMediaFavoriteViewModel {
    const { next, count, previous, results } = allMediaFavoriteResponse;
    return {
      next,
      count,
      previous,
      results: results.map((media) => this.fromMediaDetailType__MediaDetailViewModel(media)),
    };
  }

  fromMediaRelatedResponse__MediaRelatedViewModel(mediaRelatedResponse: MediaRelatedResponse): MediaRelatedViewModel {
    const { results } = mediaRelatedResponse;
    if (results) {
      const resultsVM = results.map((contentDetail) => this.fromMediaRelatedDetailResponse__MediaRelatedDetailViewModel(contentDetail));
      return {
        results: resultsVM,
      };
    }
    return {
      results: [],
    };
  }

  fromMediaRelatedDetailResponse__MediaRelatedDetailViewModel(
    mediaRelatedDetailResponse: MediaRelatedDetailResponse
  ): MediaRelatedDetailViewModel {
    const { id, name, thumbnail, media_type } = mediaRelatedDetailResponse;
    return {
      id,
      name,
      thumbnail,
      mediaType: media_type,
    };
  }

  fromBorrowMediaResponse__BorrowMediaViewModel(borrowErrorable: BorrowErrorableResponse): BorrowErrorableViewModel {
    const { success, error, code } = borrowErrorable;
    return {
      success,
      error,
      code,
    };
  }
}
