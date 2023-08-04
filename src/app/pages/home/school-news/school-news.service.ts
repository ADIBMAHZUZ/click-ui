import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SCHOOL_NEWS_BOARD_ENDPOINTS } from 'src/app/shared/utils/endpoints.api';
import {
  SchoolNewsResponse,
  SchoolNewsViewModel,
  NewsDetailViewModel,
  NewsDetailResponse,
} from 'src/app/core/models';

import { ModelConverterService } from 'src/app/core/services/model-converter.service';

@Injectable({ providedIn: 'root' })
export class SchoolNewsBoardService {
  constructor(
    private httpClient: HttpClient,
    private converter: ModelConverterService
  ) {}

  getSchoolNewsBoard(query: string): Observable<SchoolNewsViewModel> {
    return this.httpClient
      .get<SchoolNewsResponse>(SCHOOL_NEWS_BOARD_ENDPOINTS.schoolNewsBoard, {
        params: { title: query },
      })
      .pipe(
        map((response: SchoolNewsResponse) =>
          this.converter.fromSchoolNewsResponse__SchoolNewsViewModel(response)
        )
      );
  }

  getNewsById(id: string): Observable<NewsDetailViewModel> {
    return this.httpClient
      .get<NewsDetailResponse>(
        `${SCHOOL_NEWS_BOARD_ENDPOINTS.schoolNewsBoard}${id}/`
      )
      .pipe(
        map((response: NewsDetailResponse) =>
          this.converter.fromNewsDetailResponse__NewsDetailViewModel(response)
        )
      );
  }

  getSchoolNewsBoardPage(link: string): Observable<SchoolNewsViewModel> {
    return this.httpClient
      .get<SchoolNewsResponse>(link)
      .pipe(
        map((response: SchoolNewsResponse) =>
          this.converter.fromSchoolNewsResponse__SchoolNewsViewModel(response)
        )
      );
  }
}
