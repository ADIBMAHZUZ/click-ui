import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MEDIA_ENDPOINTS } from 'src/app/shared/utils/endpoints.api';
import {
  CategoriesViewModel,
  CategoriesResponse,
  MediasByCategoryResponse,
  MediasByCategoryViewModel,
  DownloadedMediasViewModel,
  MediaDetailResponse,
  BorrowMediaRequestParams,
  DownloadedMediasResponse,
  MediaFavoriteViewModel,
  MediaFavoriteResponse,
  AllMediaFavoriteViewModel,
  AllMediaFavoriteResponse,
  MediaRelatedViewModel,
  MediaRelatedResponse,
  BorrowErrorableViewModel,
  BorrowErrorableResponse,
  DownloadMediaDetailStateModel,
} from '../models';
import { Successable, MediaType } from 'src/app/core/models';

import { Converter } from './converter.service';

@Injectable({ providedIn: 'root' })
export class LibraryMediaService {
  constructor(private httpClient: HttpClient, private converter: Converter) {}

  public addFavoriteById(id: string): Observable<MediaFavoriteViewModel> {
    return this.httpClient
      .post<MediaFavoriteResponse>(`${MEDIA_ENDPOINTS.media}${id}/favorite/`, {})
      .pipe(map((response) => this.converter.fromMediaFavoriteResponse__MediaFavoriteViewModel(response)));
  }

  public borrowBookById(id: string, expirationTime: string): Observable<BorrowErrorableViewModel> {
    const params: BorrowMediaRequestParams = {
      expiration_time: expirationTime,
    };
    return this.httpClient
      .post<BorrowErrorableResponse>(`${MEDIA_ENDPOINTS.media}${id}/borrow/`, params)
      .pipe(map((response: BorrowErrorableResponse) => this.converter.fromBorrowMediaResponse__BorrowMediaViewModel(response)));
  }

  public deleteFavoriteById(id: string): Observable<MediaFavoriteViewModel> {
    return this.httpClient
      .delete<MediaFavoriteResponse>(`${MEDIA_ENDPOINTS.media}${id}/favorite/`, {})
      .pipe(map((response) => this.converter.fromMediaFavoriteResponse__MediaFavoriteViewModel(response)));
  }

  public extendBookById(id: string, expirationTime: string): Observable<Successable> {
    const params: BorrowMediaRequestParams = {
      expiration_time: expirationTime,
    };
    return this.httpClient.post<Successable>(`${MEDIA_ENDPOINTS.media}${id}/extend/`, params);
  }

  public getDownloadedMedias(): Observable<DownloadedMediasViewModel> {
    return this.httpClient
      .get<DownloadedMediasResponse>(MEDIA_ENDPOINTS.mediaSubcriber)
      .pipe(map((response: DownloadedMediasResponse) => this.converter.fromDownloadedMediasResponse__DownloadedMediasViewModel(response)));
  }

  public getFavoriteByMediaType(mediaType: MediaType): Observable<AllMediaFavoriteViewModel> {
    return this.httpClient
      .get<AllMediaFavoriteResponse>(MEDIA_ENDPOINTS.mediaFavorite, {
        params: { media_type: mediaType },
      })
      .pipe(map((response) => this.converter.fromAllMediaFavoriteResponse__AllMediaFavoriteViewModel(response)));
  }

  public getMediaById(id: string): Observable<DownloadMediaDetailStateModel> {
    return this.httpClient.get<MediaDetailResponse>(`${MEDIA_ENDPOINTS.media}${id}/`).pipe(
      map((response: MediaDetailResponse) => {
        if (response.results) {
          return this.converter.fromMediaDetailResponse__DownloadMediaDetailStateModel(response);
        }
        return null;
      })
    );
  }

  public getMediasByCategoryId(id: string, mediaType: MediaType, query?: string): Observable<MediasByCategoryViewModel> {
    return this.httpClient
      .get<MediasByCategoryResponse>(MEDIA_ENDPOINTS.media, {
        params: { category: id, media_type: mediaType, name: query },
      })
      .pipe(map((response) => this.converter.fromMediasByCategoryResponse_MediasByCategoryViewModel(response)));
  }

  public getMediasByCategoryIdMore(next): Observable<MediasByCategoryViewModel> {
    return this.httpClient
      .get<MediasByCategoryResponse>(next)
      .pipe(map((response) => this.converter.fromMediasByCategoryResponse_MediasByCategoryViewModel(response)));
  }

  public getMediasByMediaType(mediaType?: MediaType, query?: string): Observable<CategoriesViewModel> {
    let params: any = {};
    if (mediaType) {
      params.media_type = mediaType;
    }
    if (query) {
      params.name = query;
    }
    return this.httpClient
      .get<CategoriesResponse>(MEDIA_ENDPOINTS.media, {
        params,
      })
      .pipe(map((response) => this.converter.fromCategoriesResponse__CategoriesViewModel(response)));
  }

  public returnBookById(id: string): Observable<Successable> {
    return this.httpClient.post<Successable>(`${MEDIA_ENDPOINTS.media}${id}/return/`, {});
  }

  public getRelatedMedia(id: string): Observable<MediaRelatedViewModel> {
    return this.httpClient
      .get<MediaRelatedResponse>(`${MEDIA_ENDPOINTS.media}${id}/related/`)
      .pipe(map((response: MediaRelatedResponse) => this.converter.fromMediaRelatedResponse__MediaRelatedViewModel(response)));
  }

  public toggleReserveById(id: string, isCancelled: boolean): Observable<Successable> {
    return this.httpClient.post<Successable>(`${MEDIA_ENDPOINTS.media}${id}/reserve/`, { is_cancel: isCancelled });
  }
}
