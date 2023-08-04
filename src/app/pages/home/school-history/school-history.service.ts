import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SCHOOL_HISTORY_ENDPOINTS } from 'src/app/shared/utils/endpoints.api';
import {
  SchoolHistoryResponse,
  SchoolHistoryViewModel,
  HistoryDetailViewModel,
  HistoryDetailResponse,
} from 'src/app/core/models';

import { ModelConverterService } from 'src/app/core/services/model-converter.service';

@Injectable({ providedIn: 'root' })
export class SchoolHistoryService {
  constructor(
    private httpClient: HttpClient,
    private converter: ModelConverterService
  ) {}
  getSchoolHistory(query: string): Observable<SchoolHistoryViewModel> {
    return this.httpClient
      .get<SchoolHistoryResponse>(SCHOOL_HISTORY_ENDPOINTS.schoolHistory, {
        params: { title: query },
      })
      .pipe(
        map((response: SchoolHistoryResponse) =>
          this.converter.fromSchoolHistoryResponse__SchoolHistoryViewModel(
            response
          )
        )
      );
  }
  getSchoolHistoryNext(url: string): Observable<SchoolHistoryViewModel> {
    return this.httpClient
      .get<SchoolHistoryResponse>(url)
      .pipe(
        map((response: SchoolHistoryResponse) =>
          this.converter.fromSchoolHistoryResponse__SchoolHistoryViewModel(
            response
          )
        )
      );
  }
  getHistoryById(id: string): Observable<HistoryDetailViewModel> {
    return this.httpClient
      .get<HistoryDetailResponse>(
        `${SCHOOL_HISTORY_ENDPOINTS.schoolHistory}${id}/`
      )
      .pipe(
        map((response: HistoryDetailResponse) =>
          this.converter.fromHistoryDetailResponse__HistoryDetailViewModel(
            response
          )
        )
      );
  }
}
