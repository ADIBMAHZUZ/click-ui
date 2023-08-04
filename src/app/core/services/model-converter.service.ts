import { Injectable } from '@angular/core';
import {
  SchoolNewsResponse,
  SchoolNewsViewModel,
  NewsDetailResponse,
  NewsDetailViewModel,
  SchoolHistoryResponse,
  SchoolHistoryViewModel,
  HistoryDetailResponse,
  HistoryDetailViewModel,
  StudentContentResponse,
  StudentContentViewModel,
  ContentDetailResponse,
  ContentDetailViewModel,
  LibrarianResponse,
  MaterialCategoryResponse,
  MaterialDetailResponse,
  MaterialDetailType,
  MaterialCategoriesResponse,
  LibrarianViewModel,
  MaterialCategoryViewModel,
  MaterialDetailViewModel,
  MaterialCategoriesViewModel,
  MaterialByCategoryResponse,
  MaterialByCategoryViewModel,
  DownloadedMaterialResponse,
  DownloadedMaterialViewModel,
  DownloadMaterialDetailStateModel,
} from 'src/app/core/models';
import { initialDownloadDetailState } from 'src/app/shared/download/models/download-detail-state.model';

@Injectable({ providedIn: 'root' })
export class ModelConverterService {
  fromNewsDetailResponse__NewsDetailViewModel(
    newsDetailResponse: NewsDetailResponse
  ): NewsDetailViewModel {
    const {
      id,
      title,
      content,
      photo,
      created_by,
      updated_by,
      is_active,
      publish_date,
    } = newsDetailResponse;
    return {
      id,
      title,
      content,
      photo,
      createdBy: created_by,
      updatedBy: updated_by,
      isActive: is_active,
      publishDate: publish_date,
    };
  }

  fromSchoolNewsResponse__SchoolNewsViewModel(
    schoolNewsResponse: SchoolNewsResponse
  ): SchoolNewsViewModel {
    const { results, count, next, previous } = schoolNewsResponse;
    const resultsVM = results.map((newsDetail) =>
      this.fromNewsDetailResponse__NewsDetailViewModel(newsDetail)
    );
    return {
      count,
      next,
      previous,
      results: resultsVM,
    };
  }

  fromHistoryDetailResponse__HistoryDetailViewModel(
    historyDetailResponse: HistoryDetailResponse
  ): HistoryDetailViewModel {
    const {
      id,
      title,
      content,
      photo,
      created_by,
      updated_by,
      is_active,
      publish_date,
    } = historyDetailResponse;
    return {
      id,
      title,
      content,
      photo,
      createdBy: created_by,
      updatedBy: updated_by,
      isActive: is_active,
      publishDate: publish_date,
    };
  }

  fromSchoolHistoryResponse__SchoolHistoryViewModel(
    schoolHistoryResponse: SchoolHistoryResponse
  ): SchoolHistoryViewModel {
    const { results, count, next, previous } = schoolHistoryResponse;
    const resultsVM = results.map((historyDetail) =>
      this.fromHistoryDetailResponse__HistoryDetailViewModel(historyDetail)
    );
    return {
      count,
      next,
      previous,
      results: resultsVM,
    };
  }

  fromContentDetailResponse__ContentDetailViewModel(
    contentDetailResponse: ContentDetailResponse
  ): ContentDetailViewModel {
    const {
      id,
      title,
      content,
      photo,
      created_by,
      updated_by,
      is_active,
      publish_date,
    } = contentDetailResponse;
    return {
      id,
      title,
      content,
      photo,
      createdBy: created_by,
      updatedBy: updated_by,
      isActive: is_active,
      publishDate: publish_date,
    };
  }

  fromStudentContentResponse__StudentContentViewModel(
    studentContentResponse: StudentContentResponse
  ): StudentContentViewModel {
    const { results, count, next, previous } = studentContentResponse;
    const resultsVM = results.map((contentDetail) =>
      this.fromContentDetailResponse__ContentDetailViewModel(contentDetail)
    );
    return {
      count,
      next,
      previous,
      results: resultsVM,
    };
  }

  fromLibrarianResponse__LibrarianViewModel(
    librarianResponse: LibrarianResponse
  ): LibrarianViewModel {
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
      library,
      max_subscribers,
      user_type,
    } = librarianResponse;
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
      library,
      maxSubscribers: max_subscribers,
      userType: user_type,
    };
  }

  fromMaterialCategoryResponse__MaterialCategoryViewModel(
    materialCategoryResponse: MaterialCategoryResponse
  ): MaterialCategoryViewModel {
    const {
      id,
      name,
      name_malay,
      description,
      category_type,
      is_active,
    } = materialCategoryResponse;

    return {
      id,
      name,
      nameMalay: name_malay,
      description,
      categoryType: category_type,
      isActive: is_active,
    };
  }

  fromMaterialDetailResponse__MaterialDetailViewModel(
    bookDetailResponse: MaterialDetailResponse
  ): MaterialDetailViewModel {
    return this.fromMaterialDetailType__MaterialDetailViewModel(
      bookDetailResponse.results
    );
  }
  fromMaterialDetailResponse__DownloadMaterialDetailStateModel(
    bookDetailResponse: MaterialDetailResponse
  ): DownloadMaterialDetailStateModel {
    return {
      ...initialDownloadDetailState,
      id: bookDetailResponse.results.id,
      item: this.fromMaterialDetailType__MaterialDetailViewModel(
        bookDetailResponse.results
      ),
    };
  }

  fromMaterialDetailType__MaterialDetailViewModel(
    mediaDetailType: MaterialDetailType
  ): MaterialDetailViewModel {
    const {
      id,
      name,
      is_active,
      library,
      category,
      duration,
      author,
      format_type,
      media_type,
      number_of_download,
      file_size,
      url,
      thumbnail,
      isbn,
      images,
      is_borrowed,
      published_date,
    } = mediaDetailType;

    return {
      id,
      name,
      library: library
        ? this.fromLibrarianResponse__LibrarianViewModel(library)
        : null,
      category: category
        ? this.fromMaterialCategoryResponse__MaterialCategoryViewModel(category)
        : null,
      duration,
      author,
      fileSize: file_size,
      formatType: format_type,
      mediaType: media_type,
      url,
      thumbnail,
      isActive: is_active,
      isbn,
      images,
      isBorrowed: is_borrowed,
      numberOfDownload: number_of_download,
      publishedDate: published_date,
    };
  }

  fromMaterialCategoriesResponse__MaterialCategoriesViewModel(
    materialCategoriesResponse: MaterialCategoriesResponse
  ): MaterialCategoriesViewModel {
    const { categories } = materialCategoriesResponse.results;
    const categoriesVM = categories.map((category) => {
      return {
        category: category.category,
        media: category.media.map((media) =>
          this.fromMaterialDetailResponse__MaterialDetailViewModel({
            results: media,
          })
        ),
      };
    });

    return {
      categories: categoriesVM,
    };
  }

  fromMaterialByCategoryResponse_MaterialByCategoryViewModel(
    bookByCategoryResponse: MaterialByCategoryResponse
  ): MaterialByCategoryViewModel {
    const { results } = bookByCategoryResponse;
    const { category, media } = results;
    return {
      category,
      media: {
        count: media.count,
        next: media.next,
        previous: media.previous,
        results: media.results.map((mediaItem) =>
          this.fromMaterialDetailResponse__MaterialDetailViewModel({
            results: mediaItem,
          })
        ),
      },
    };
  }

  fromDownloadedMaterialResponse__DownloadedMaterialViewModel(
    downloadedMaterialResponse: DownloadedMaterialResponse
  ): DownloadedMaterialViewModel {
    const { results } = downloadedMaterialResponse;
    const viewModelResults = results.map((bookDetailResponse) => {
      return this.fromMaterialDetailResponse__MaterialDetailViewModel({
        results: bookDetailResponse,
      });
    });
    return {
      results: viewModelResults,
    };
  }
}
