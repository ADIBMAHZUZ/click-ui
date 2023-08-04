import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DASHBOARD } from 'src/app/shared/utils/endpoints.api';
import {
  AccountInfoViewModel,
  AccountInfoResponse,
  ActivityDetailViewModel,
  ActivityDetailResponse,
  ActivitiesResponse,
  ChangePasswordViewModel,
  ChangePasswordResponse,
  ActivityCategories,
} from '../models';
import { Converter } from './converter.service';
import { MediaType } from 'src/app/core/models';
import { LibraryMediaService } from 'src/app/pages/home/library/shared';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private httpClient: HttpClient, private converter: Converter, private libraryApiService: LibraryMediaService) {}

  getUserInfo(userId: string): Observable<AccountInfoViewModel> {
    return this.httpClient
      .get<AccountInfoResponse>(DASHBOARD.dashboardUserInfo, {
        params: {
          user_id: userId,
        },
      })
      .pipe(map((response: AccountInfoResponse) => this.converter.fromAccountInfoResponse__AccountInfoViewModel(response)));
  }
  public getCategories(mediaType?: MediaType): Observable<ActivityCategories> {
    return this.libraryApiService
      .getMediasByMediaType(mediaType)
      .pipe(map((response) => response.categories.map((categoryWrapper) => categoryWrapper.category)));
  }

  public getDetails(from: string, to: string, category?: string, mediaType?: MediaType): Observable<ActivityDetailViewModel> {
    console.log('🚀 ~ file: api.service.ts:57 ~ ApiService ~ from:', from);
    return this.httpClient
      .post<ActivityDetailResponse>(DASHBOARD.dashboardActivities, {
        category: category ? category : undefined,
        media_type: mediaType ? mediaType : undefined,
        from,
        to,
      })
      .pipe(map((response: ActivitiesResponse) => this.converter.fromActivityDetailResponse__ActivityDetailViewModel(response)));
  }
  changePassword(password: string, newPassword: string, confirmPassword: string): Observable<ChangePasswordViewModel> {
    return this.httpClient
      .patch<ChangePasswordResponse>(DASHBOARD.dashboardUserChangePassword, {
        password,
        new_password: newPassword,
        confirm_password: confirmPassword,
      })
      .pipe(map((response: ChangePasswordResponse) => this.converter.fromChangePasswordResponse__ChangePasswordViewModel(response)));
  }
}
