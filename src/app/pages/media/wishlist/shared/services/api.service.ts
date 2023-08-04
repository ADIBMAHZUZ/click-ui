import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  MediaFavoriteViewModel,
  MediaFavoriteResponse,
  AllMediaFavoriteViewModel,
  AllMediaFavoriteResponse,
} from '../models';
import { Converter } from './converter.service';
import { map } from 'rxjs/operators';
import { MediaType } from 'src/app/core/models';
import { MEDIA_ENDPOINTS } from '../endpoints';

@Injectable({ providedIn: 'root' })
export class APIService {
  constructor(private httpClient: HttpClient, private _converter: Converter) {}

  public addFavoriteById(id: string): Observable<MediaFavoriteViewModel> {
    return this.httpClient
      .post<MediaFavoriteResponse>(
        MEDIA_ENDPOINTS.featureFavorite.replace(':id', id),
        {}
      )
      .pipe(
        map((response) =>
          this._converter.fromMediaFavoriteResponse__MediaFavoriteViewModel(
            response
          )
        )
      );
  }

  public deleteFavoriteById(id: string): Observable<MediaFavoriteViewModel> {
    return this.httpClient
      .delete<MediaFavoriteResponse>(
        MEDIA_ENDPOINTS.featureFavorite.replace(':id', id),
        {}
      )
      .pipe(
        map((response) =>
          this._converter.fromMediaFavoriteResponse__MediaFavoriteViewModel(
            response
          )
        )
      );
  }

  public getFavoriteByMediaType(
    mediaType: MediaType
  ): Observable<AllMediaFavoriteViewModel> {
    return this.httpClient
      .get<AllMediaFavoriteResponse>(MEDIA_ENDPOINTS.favorites, {
        params: { media_type: mediaType },
      })
      .pipe(
        map((response) =>
          this._converter.fromAllMediaFavoriteResponse__AllMediaFavoriteViewModel(
            response
          )
        )
      );
  }
}
