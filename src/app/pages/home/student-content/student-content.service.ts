import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { STUDENT_CONTENT_ENDPOINTS } from 'src/app/shared/utils/endpoints.api';
import {
  StudentContentResponse,
  StudentContentViewModel,
  ContentDetailViewModel,
  ContentDetailResponse,
} from 'src/app/core/models';

import { ModelConverterService } from 'src/app/core/services/model-converter.service';

@Injectable({ providedIn: 'root' })
export class StudentContentService {
  constructor(
    private httpClient: HttpClient,
    private converter: ModelConverterService
  ) {}

  getStudentContent(query: string): Observable<StudentContentViewModel> {
    return this.httpClient
      .get<StudentContentResponse>(STUDENT_CONTENT_ENDPOINTS.studentContent, {
        params: { title: query },
      })
      .pipe(
        map((response: StudentContentResponse) =>
          this.converter.fromStudentContentResponse__StudentContentViewModel(
            response
          )
        )
      );
  }
  getContentById(id: string): Observable<ContentDetailViewModel> {
    return this.httpClient
      .get<ContentDetailResponse>(
        `${STUDENT_CONTENT_ENDPOINTS.studentContent}${id}/`
      )
      .pipe(
        map((response: ContentDetailResponse) =>
          this.converter.fromContentDetailResponse__ContentDetailViewModel(
            response
          )
        )
      );
  }
  getStudentContentPage(link: string): Observable<StudentContentViewModel> {
    return this.httpClient
      .get<StudentContentResponse>(link)
      .pipe(
        map((response: StudentContentResponse) =>
          this.converter.fromSchoolNewsResponse__SchoolNewsViewModel(response)
        )
      );
  }
}
